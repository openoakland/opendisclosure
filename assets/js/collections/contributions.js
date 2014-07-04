OpenDisclosure.Contributions = Backbone.Collection.extend({
  url: '/api/contributions',
  model: OpenDisclosure.Contribution,
  initialize: function(){
    this.fetch();
  }
});
OpenDisclosure.CategoryContributions = Backbone.Collection.extend({
  url: '/api/category_contributions',
  model: OpenDisclosure.CategoryContribution,
  initialize: function(){
    this.fetch();
  }
});
OpenDisclosure.EmployerContributions = Backbone.Collection.extend({
  url: '/api/employer_contributions',
  model: OpenDisclosure.EmployerContribution,
  initialize: function(){
    this.fetch();
  }
});
OpenDisclosure.Whales = Backbone.Collection.extend({
  url: '/api/whales',
  model: OpenDisclosure.Whale,
  initialize: function(){
    this.fetch();
  }
});
OpenDisclosure.Contributors = Backbone.Collection.extend({
  model: OpenDisclosure.Contributor,
  url: function() {
    return '/api/contributor/' + this.options.contributor;
  },
  initialize: function(options){
    this.options = options;
    this.fetch();
  }
});
