OpenDisclosure.Views.Candidate = Backbone.View.extend({

  template: _.template("\
    <div id='candidate'>\
    <h2 class='mayoral-context-header'>Campaign Finance for the 2014 Oakland Mayoral Election</h2>\
    <img class='visible-xs mayor-picture-inline' style='float: left; margin-right: 12px;' src='<%= candidate.imagePath() %>' />\
    <h1><%= candidate.get('short_name') %></h1>\
    <% if (candidate.get('summary') !== null) { %>\
      <section class='clearfix' id='mathbar'>\
        <div class='col-sm-3 money-label'>Total Contributions <br><span class='money-number'><%= candidate.totalContributions() %></span><span class='mathsign'>–</span></div>\
        <div class='col-sm-3 money-label'>Expenditures <br><span class='money-number'><%= candidate.friendlySummaryNumber('total_expenditures_made') %></span><span class='mathsign'>=</span></div>\
        <div class='col-sm-3 money-label'>Available Balance<br><span class='money-number'><%= candidate.availableBalance() %></span></div>\
        <div class='col-sm-3 money-label count'> No. of Contributions <br><span class='money-number'><%= candidate.get('received_contributions_count') %></span></div>\
      </section>\
    <% } %>\
    <section class='clearfix' id= 'candidateDetails'>\
      <div class='col-sm-3'>\
        <img class='hidden-xs' src='<%= candidate.imagePath() %>' />\
        <p><%= candidate.get('profession') %></p>\
        <p>Party Affiliation: <%= candidate.get('party_affiliation') %></p>\
        <p><i class='fa fa-twitter fa-2x'></i><a id='twitter' href='https://twitter.com/<%= candidate.get('twitter') %>'><%= candidate.get('twitter') %></a></p>\
      </div>\
      <div class='col-sm-5'>\
        <p><%= candidate.get('bio') %></p>\
        <div class='sources'>\
        <span>Sources</span><br>\
          <% (candidate.get('sources') || []).forEach(function (source) { %>\
            <a href='<%= source.uri %>'><%= source.name %></a><br>\
          <% }) %>\
        </div>\
      </div>\
      <div class='col-sm-4'>\
        <% if (candidate.get('summary') !== null) { %>\
          <p>Percentage of total contributions that are small contributions*: <%= candidate.pctSmallContributions() %></p>\
          <p>Personal funds loaned and contributed to campaign: <%= OpenDisclosure.friendlyMoney(candidate.get('self_contributions_total')) %></p>\
          <p>% of the total amount raised is personal funds: <%= OpenDisclosure.friendlyPct(candidate.get('self_contributions_total') / candidate.get('summary').total_contributions_received) %></p>\
          <p>Declared candidacy: <%= candidate.get('declared') %> </p>\
          <p>Data last updated: <%= candidate.get('summary').last_summary_date %> </p>\
          <p class='sources'>* Candidates do not need to itemize contributions less than $100 by contributor, but do need to include all contributions in their total reported amount.  <b><a href='/faq#smallContributions'>FAQ</a> </b></p>\
        <% } %>\
      </div>\
      <% if (candidate.get('summary') == null) { %>\
        <div class='col-sm-4 noContributions'>The candidate had not reported any campaign contributions by the last filing deadline. Candidates are not required to report if they have raised less than $1,000.</div>\
        <% } %>\
    </section>\
    <section class='clearfix' id= 'category'></section>\
    <section class='clearfix' id= 'topContributors'></section>\
    <section class='clearfix' id= 'contributors'></section>\
    </div>\
  "),

  initialize: function(options) {
    this.candidateName = options.candidateName;

    if (OpenDisclosure.Data.candidates.length > 0) {
      this.findCandidateAndRender();
    }

    this.listenTo(OpenDisclosure.Data.candidates, 'sync', this.findCandidateAndRender);
  },

  findCandidateAndRender: function() {
    var shortNameMatches = function(c) {
      return c.linkPath().indexOf(this.candidateName) >= 0;
    }.bind(this);

    var candidate = OpenDisclosure.Data.candidates.find(shortNameMatches);

    if (candidate) {
      this.model = candidate;
      this.contributions = new OpenDisclosure.Contributions([], { candidateId: candidate.attributes.id });
      this.contributions.fetch();
      this.render();
    }
  },

  render: function(){
    //Render main view
    this.$el.html(this.template({ candidate: this.model }));

    if (this.model.get('summary') !== null){
      //Render Subviews
      if (OpenDisclosure.Data.categoryContributions.length > 0) {
        this.renderCategoryChart();
      }

      if (OpenDisclosure.Data.employerContributions.length > 0) {
        this.renderTopContributors();
      }

      if (this.contributions.length > 0) {
        this.renderAllContributions();
      }
    } else {
      $('#category').hide();
      $('#topContributors').hide();
      $('#contributors').hide();
    }


    //Listen for new data
    this.listenTo(OpenDisclosure.Data.categoryContributions, 'sync', this.renderCategoryChart);
    this.listenTo(OpenDisclosure.Data.employerContributions, 'sync', this.renderTopContributors);
    this.listenTo(this.contributions, 'sync', this.renderAllContributions);
  },

  renderCategoryChart: function() {
    var candidateId = this.model.attributes.id;
    this.categories = _.filter(OpenDisclosure.Data.categoryContributions.models, function(c) {
      return c.attributes.recipient_id == candidateId;
    });

    new OpenDisclosure.CategoryView({
      el: '#category',
      collection: this.categories,
      attributes: this.model.attributes
    });
  },

  renderTopContributors: function(){
    // Filter contributors based on cadidateId
    var count = 0;
    var candidateId = this.model.attributes.id;

    this.topContributions = _.filter(OpenDisclosure.Data.employerContributions.models, function(c) {
      return c.attributes.recipient_id == candidateId;
    }).sort(function(a, b){return b.attributes.amount - a.attributes.amount});

    // Create a new subview
    new OpenDisclosure.TopContributorsView({
      el: "#topContributors",
      collection: this.topContributions.slice(0, 10),
      candidate: this.model.get('short_name')
    });
  },

  renderAllContributions: function(){
    var candidateId = this.model.attributes.id;

    new OpenDisclosure.ContributorsView({
      el: "#contributors",
      collection: this.contributions,
      headline: 'All Contributions to ' + this.model.get('short_name')
    });
  },

  updateNav: function(){
    $('.sidebar li').removeClass('active');
    $('#nav-'+this.model.attributes.id).addClass('active');
  }

});
