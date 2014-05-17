
OpenDisclosure.AppView = Backbone.View.extend({

  initialize : function() {

    this.candidates = new OpenDisclosure.Candidates();
    new OpenDisclosure.CandidateTable({ collection : this.candidates });

    this.contributions = new OpenDisclosure.ContributionCollection();
    new OpenDisclosure.ChartsView({ collection : this.contributions });

  }

});


$(function(){
  app = new OpenDisclosure.AppView();
});
