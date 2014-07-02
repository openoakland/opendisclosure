OpenDisclosure.App = Backbone.Router.extend({
  routes: {
    '/': 'home',
    'candidate/:id': 'candidate',
    'contributor/:id': 'contributor'
  },

  initialize : function() {
    this.candidates = new OpenDisclosure.Candidates();
    this.contributions = new OpenDisclosure.Contributions();
    this.employerContributions = new OpenDisclosure.EmployerContributions();
    this.categoryContributions = new OpenDisclosure.CategoryContributions();
    this.whales = new OpenDisclosure.Whales();
    this.home();
  },

  home: function(){
    new OpenDisclosure.CandidateTable({ collection : this.candidates });
    new OpenDisclosure.ZipcodeChartView({
      collection: this.contributions,
      base_height: 480
    });
    this.listenTo(this.whales, 'sync', function() {
      console.log('Received whale data!');
      new OpenDisclosure.ContributorsView({collection: this.whales.models, headline:'Top Contributors To All Candidates in This Election'});
    });
  },

  candidate: function(id){
    new OpenDisclosure.CandidateView({model: this.candidates.get(id)});
  },

  contributor : function() {

  }

});

$(function(){
  app = new OpenDisclosure.App();
  Backbone.history.start();
});
