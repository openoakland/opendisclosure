OpenDisclosure.Contributions = Backbone.Collection.extend({
  url: '/api/contributions',
  model: OpenDisclosure.Contribution,
  initialize: function(){
    this.fetch();
  }
});
