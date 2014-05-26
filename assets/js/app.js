OpenDisclosure.App = Backbone.Router.extend({
  routes: {
    '/': 'home',
    'candidate/:id': 'candidate',
    'contributor/:id': 'contributor'
  },

  initialize : function() {
    if(!this.candidates){this.candidates = new OpenDisclosure.Candidates();}
    if(!this.contributions){this.contributions = new OpenDisclosure.Contributions();}
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
