OpenDisclosure.Views.Candidate = Backbone.View.extend({
  template: HandlebarsTemplates['candidate'],

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
    this.$el.html(this.template(this.templateContext()));

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

  templateContext: function() {
    var context = _.clone(this.model.attributes);

    context.imagePath = this.model.imagePath();

    if (this.model.get('summary') !== null) {
      context.summary.lastSummaryDate = this.model.get('summary').last_summary_date;
      context.summary.totalContributions = this.model.totalContributions();
      context.summary.availableBalance = this.model.availableBalance();
      context.summary.totalExpenditures = this.model.friendlySummaryNumber('total_expenditures_made');
      context.summary.pctPersonalContributions = OpenDisclosure.friendlyPct(this.model.get('self_contributions_total') / this.model.get('summary').total_contributions_received);
      context.summary.pctSmallContributions = this.model.pctSmallContributions();
    }

    return context;
  }
});
