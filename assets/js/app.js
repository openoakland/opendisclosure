OpenDisclosure.App = Backbone.Router.extend({
  routes: {
    '/': 'homepage',
    'candidate/:id': 'candidateView'
  },

  initialize : function() {
    this.homepage();
  },

  homepage: function(){
    this.candidates = new OpenDisclosure.Candidates();
    new OpenDisclosure.CandidateTable({ collection : this.candidates });

    this.contributions = new OpenDisclosure.ContributionCollection();
    new OpenDisclosure.ChartsView({ collection : this.contributions });

  },

  candidateView: function(id){

    if (!this.candidates){
      this.candidates = new OpenDisclosure.Candidates();
    }

    this.candidate = this.candidates.get(id);
    console.log ('candidate', this.candidate);

    new OpenDisclosure.CandidateView({model: this.candidate});
  }

});


$(function(){
  app = new OpenDisclosure.App();
  Backbone.history.start();
});
