OpenDisclosure.Candidates = Backbone.Collection.extend({
  url: '/api/candidates',
  model: OpenDisclosure.Candidate,
  initialize: function(){
    this.fetch();
    this.listenTo(this, 'sync', function() {
      this.loaded = true;
    });
  }
});
