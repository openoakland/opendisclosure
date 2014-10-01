OpenDisclosure.Contributions = Backbone.Collection.extend({
  url: function() {
    return '/api/contributions/candidate/' + this.options.candidateId;
  },
  model: OpenDisclosure.Contribution,
  initialize: function(models, options) {
    this.options = options;
  }
});
OpenDisclosure.CommitteeContributions = Backbone.Collection.extend({
  url: function() {
    return '/api/contributions/committee/' + encodeURI(this.options.committeeName);
  },
  model: OpenDisclosure.Contribution,
  initialize: function(models, options) {
    this.options = options;
  }
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
  comparator: function (model) {
    return model.get('contributor').name;
  },
  url: function() {
    if (this.options.contributor) {
      return '/api/contributor/' + this.options.contributor;
    } else {
      return '/api/contributorName/' + encodeURI(this.options.search);
    }

  },
  initialize: function(models, options) {
    this.options = options;
  }
});
OpenDisclosure.Employees = Backbone.Collection.extend({
  model: OpenDisclosure.Employee,
  url: function() {
    return '/api/employees/' + this.options.employer_id;
  },
  initialize: function(models, options){
    this.options = options;
  }
});
