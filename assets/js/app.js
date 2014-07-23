OpenDisclosure.App = Backbone.Router.extend({
  routes: {
    '': 'home',
    'about': 'about',
    'candidate/:id': 'candidate',
    'contributor/:id': 'contributor'
  },

  initialize : function() {
    this.candidates = new OpenDisclosure.Candidates();
    this.contributions = new OpenDisclosure.Contributions();
    this.employerContributions = new OpenDisclosure.EmployerContributions();
    this.categoryContributions = new OpenDisclosure.CategoryContributions();
    this.whales = new OpenDisclosure.Whales();
    this.multiples = new OpenDisclosure.Multiples();
  },

  home: function(){

    new OpenDisclosure.CandidateTable({ collection : this.candidates });
    new OpenDisclosure.ZipcodeChartView({
      collection: this.contributions,
      base_height: 480
    });
    new OpenDisclosure.DailyContributionsChartView({
      collection: this.contributions,
      base_height: 480
    })
    this.listenTo(this.whales, 'sync', function() {
      console.log('Received whale data!');
      new OpenDisclosure.ContributorsView({collection: this.whales.models, headline:'Top Contributors To All Candidates in This Election'});
    });
    this.listenTo(this.multiples, 'sync', function() {
      console.log('Received multiples data!');
      new OpenDisclosure.MultiplesView({collection: this.multiples.models, headline:'Contributors To More Than One Mayoral Candidate'});
    });
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
    })
    new OpenDisclosure.DailyContributionsChartView({
      collection: this.contributions,
      base_height: 480
    });
  },

  about: function () {
    new OpenDisclosure.AboutView();
  },

  candidate: function(id){
    if (this.candidates.loaded)
      new OpenDisclosure.CandidateView({model: this.candidates.get(id)});
    else
      this.listenTo(this.candidates, 'sync', function() {
	new OpenDisclosure.CandidateView({model: this.candidates.get(id)});
      });
  },

  contributor : function(id) {
    var contrib = new OpenDisclosure.Contributors({contributor: id} );
    this.listenTo(contrib, 'sync', function() {
      new OpenDisclosure.ContributorView({collection: contrib.models});
    });
  }

});

$(function(){
  app = new OpenDisclosure.App();
  Backbone.history.start();
});
