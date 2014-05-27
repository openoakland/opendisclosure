<<<<<<< HEAD
=======
// OpenDisclosure.AppView = Backbone.View.extend({

//   initialize : function() {

//     this.candidates = new OpenDisclosure.Candidates();
//     new OpenDisclosure.CandidateTable({ collection : this.candidates });

//     this.contributions = new OpenDisclosure.ContributionCollection();
//     new OpenDisclosure.ChartsView({ collection : this.contributions });

//   }

// });



>>>>>>> Chart loads via backbone chart wrapper
OpenDisclosure.App = Backbone.Router.extend({
  routes: {
    '/': 'home',
    'candidate/:id': 'candidate',
    'contributor/:id': 'contributor'
  },

<<<<<<< HEAD
  initialize : function() {
    if(!this.candidates){this.candidates = new OpenDisclosure.Candidates();}
    if(!this.contributions){this.contributions = new OpenDisclosure.Contributions();}
    if(!this.employerContributions){this.employerContributions = new OpenDisclosure.EmployerContributions();}
    this.home();
  },

  home: function(){
    new OpenDisclosure.CandidateTable({ collection : this.candidates });
    new OpenDisclosure.ChartsView({ collection : this.contributions });
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

=======
  initialize: function() {
    this.homepage();
  },

  homepage: function() {
    this.candidates = new OpenDisclosure.Candidates();
    new OpenDisclosure.CandidateTable({
      collection: this.candidates
    });

    this.contributions = new OpenDisclosure.ContributionCollection();
    new OpenDisclosure.ZipcodeChartView({
      el: '#zip-bubble-chart',
      collection: this.contributions, //,
      base_height: 480
    })
  },

  candidateView: function(id) {

    if (!this.candidates) {
      this.candidates = new OpenDisclosure.Candidates();
    }

    this.candidate = this.candidates.get(id);
    console.log('candidate', this.candidate);

    new OpenDisclosure.CandidateView({
      model: this.candidate
    });
>>>>>>> Chart loads via backbone chart wrapper
  }

});


<<<<<<< HEAD
$(function(){
  Backbone.history.start();
  app = new OpenDisclosure.App();
});
=======
$(function() {
  app = new OpenDisclosure.App();
  Backbone.history.start();
});
>>>>>>> Chart loads via backbone chart wrapper
