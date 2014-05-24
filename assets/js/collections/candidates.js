OpenDisclosure.Candidates = Backbone.Collection.extend({
  url: '/api/candidates',
  model: OpenDisclosure.Candidate,
  initialize: function(){
    this.fetch();
  }
});
