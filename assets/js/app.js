OpenDisclosure.App = Backbone.Router.extend({
  routes: {
    '/': 'home',
    'candidate/:id': 'candidate',
    'contributor/:id': 'contributor'
  },

  initialize : function() {
    if(!this.candidates){this.candidates = new OpenDisclosure.Candidates();}
    if(!this.contributions){this.contributions = new OpenDisclosure.Contributions();}
    if(!this.employerContributions){this.employerContributions = new OpenDisclosure.EmployerContributions();}
    this.home();
  },

  home: function(){
    new OpenDisclosure.CandidateTable({ collection : this.candidates });
    new OpenDisclosure.ZipcodeChartView({
      el: '#zip-bubble-chart',
      collection: this.contributions, 
      base_height: 480
    });

    new OpenDisclosure.DailyContributionsChartView({
      el: '#daily-contributions-chart',
      collection: this.contributions,
      base_height: 480
    })
  },

  candidate: function(id){
    if (!this.candidates){ this.candidates = new OpenDisclosure.Candidates();}
    this.currentCandidate = this.candidates.get(id);
    new OpenDisclosure.CandidateView({model: this.currentCandidate});

    // Render Top Contributions
    var that = this;
    var count = 0;
    this.topContributions = _.filter(this.employerContributions.models, function(c) {
      return c.attributes.recipient_id == that.currentCandidate.id && ++count <= 10;
    });

    new OpenDisclosure.TopContributorsView({collection: this.topContributions});

    // Render Contributions
    var that = this;
    this.filteredContributions = _.filter(this.contributions.models, function(c) {
      return c.attributes.recipient.id == that.currentCandidate.id;
    });

    new OpenDisclosure.ContributorsView({collection: this.filteredContributions});
  },

  contributor : function(){

  }

});

$(function(){
  Backbone.history.start();
  app = new OpenDisclosure.App();
});