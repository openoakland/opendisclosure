
// COLLECTIONS
OpenDisclosure.Candidates = Backbone.Collection.extend({
  url: '/api/candidates',
  model: OpenDisclosure.Candidate,
  initialize: function(){
    this.fetch();
  }
});

OpenDisclosure.ContributionCollection = Backbone.Collection.extend({
  url: '/api/contributions',
  model: OpenDisclosure.Contribution,
  initialize: function(){
    this.fetch();
  }
});