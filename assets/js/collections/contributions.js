OpenDisclosure.Contributions = Backbone.Collection.extend({
  url: '/api/contributions',
  model: OpenDisclosure.Contribution
});
OpenDisclosure.CategoryContributions = Backbone.Collection.extend({
  url: '/api/category_contributions',
  model: OpenDisclosure.CategoryContribution
});
OpenDisclosure.EmployerContributions = Backbone.Collection.extend({
  url: '/api/employer_contributions',
  model: OpenDisclosure.EmployerContribution
});
OpenDisclosure.Whales = Backbone.Collection.extend({
  url: '/api/whales',
  model: OpenDisclosure.Whale
});
OpenDisclosure.Multiples = Backbone.Collection.extend({
  url: '/api/multiples',
  model: OpenDisclosure.Multiple
});
OpenDisclosure.Contributors = Backbone.Collection.extend({
  model: OpenDisclosure.Contributor,
  url: function() {
    return '/api/contributor/' + this.options.contributor;
  },
  initialize: function(models, options) {
    this.options = options;
  }
});
