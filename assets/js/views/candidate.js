OpenDisclosure.CandidateView = Backbone.View.extend({
  template: _.template("\
    <h2 class='mayor2014'>Campaign Finance for the 2014 Oakland Mayoral Election</h2>\
    <h1><%= attributes.short_name %></h1>\
    <% if (attributes.summary !== null) { %>\
      <section class='clearfix' id='mathbar'>\
        <div class='col-sm-3 money-label'>Total Contributions <br><span class='money-number'><%= friendlySummaryNumber('total_contributions_received') %></span><span class='mathsign'>–</span></div>\
        <div class='col-sm-3 money-label'>Expenditures <br><span class='money-number'><%= friendlySummaryNumber('total_expenditures_made') %></span><span class='mathsign'>=</span></div>\
        <div class='col-sm-3 money-label'>Cash On Hand <br><span class='money-number'><%= friendlySummaryNumber('ending_cash_balance') %></span></div>\
        <div class='col-sm-3 money-label count'> No. of Contributions <br><span class='money-number'><%= attributes.received_contributions_count %></span></div>\
      </section>\
    <% } %>\
    <section class='clearfix' id= 'candidateDetails'>\
        <div class='col-sm-3'>\
          <img class='mayor-picture' src='<%= attributes.imagePath %>' />\
          <p><%= attributes.profession %></p>\
          <p>Party Affiliation: <%= attributes.party_affiliation %></p>\
          <p><a id='twitter' href='https://twitter.com/<%= attributes.twitter %>'><%= attributes.twitter %></a></p>\
        </div>\
        <div class='col-sm-5'>\
          <p><%= attributes.bio %></p>\
          <div class='sources'>\
          <span>Sources</span><br>\
            <% (attributes.sources || []).forEach(function (source) { %>\
              <a href='<%= source.uri %>'><%= source.name %></a><br>\
            <% }) %>\
          </div>\
        </div>\
        <div class='col-sm-4'>\
          <p>Percentage of small donors*: <%= pctSmallContributions() %></p>\
          <p>Personal funds loaned and contributed to campaign: <%= OpenDisclosure.friendlyMoney(attributes.self_contributions_total) %></p>\
          <% if (attributes.summary !== null) { %>\
            <p>% of the total amount raised is personal funds: <%= OpenDisclosure.friendlyPct(attributes.self_contributions_total / attributes.summary.total_contributions_received) %></p>\
          <% } %>\
          <p>Declared candidacy: <%= attributes.declared %> </p>\
          <p>Data last updated: <%= attributes.summary.last_summary_date %> </p>\
          <p class='sources'>* Candidates do not need to itemize contributions less than $100 by contributor, but do need to include all contributions in their total reported amount. </p>\
        </div>\
    </section>\
    <section class='clearfix' id= 'category'></section>\
    <section class='clearfix' id= 'topContributors'></section>\
    <section class='clearfix' id= 'contributors'></section>\
  "),

  initialize: function(){
    if (this.model) {
      this.model.attributes.imagePath = this.model.imagePath();
      this.render();
    } else {
      app.navigate('', true);
    }
  },

  render: function(){
    //Render main view
    this.$el.html(this.template(this.model));

    //Render Subviews
    if (OpenDisclosure.Data.categoryContributions.length > 0) {
      this.renderCategoryChart();
    }

    if (OpenDisclosure.Data.employerContributions.length > 0) {
      this.renderTopContributors();
    }

    if (OpenDisclosure.Data.contributions.length > 0) {
      this.renderAllContributions();
    }

    //Listen for new data
    this.listenTo(OpenDisclosure.Data.categoryContributions, 'sync', this.renderCategoryChart);
    this.listenTo(OpenDisclosure.Data.employerContributions, 'sync', this.renderTopContributors);
    this.listenTo(OpenDisclosure.Data.contributions, 'sync', this.renderAllContributions);
  },

  renderCategoryChart: function() {
    var candidateId = this.model.attributes.id;
    this.categories = _.filter(OpenDisclosure.Data.categoryContributions.models, function(c) {
      return c.attributes.recipient_id == candidateId;
    });

    new OpenDisclosure.CategoryView({
      el: '#category',
      collection: this.categories,
      summary: this.model.attributes.summary
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
      collection: this.topContributions.slice(0, 10)
    });
  },

  renderAllContributions: function(){
    var candidateId = this.model.attributes.id;
    var filteredContributions = _.filter(OpenDisclosure.Data.contributions.models, function(c) {
      return c.attributes.recipient.id == candidateId;
    });

    new OpenDisclosure.ContributorsView({
      el: "#contributors",
      collection: new OpenDisclosure.Contributions(this.filteredContributions),
      headline: 'All Contributions'
    });
  },

  updateNav: function(){
    $('.sidebar li').removeClass('active');
    $('#nav-'+this.model.attributes.id).addClass('active');
  }

});
