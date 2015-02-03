OpenDisclosure.Payments = Backbone.Collection.extend({
  url: function() {
    return '/api/payments/' + this.options.candidateId;
  },
  model: OpenDisclosure.Payment,
  initialize: function(models, options) {
    this.options = options;
  }
});
OpenDisclosure.CategoryPayments = Backbone.Collection.extend({
  url: '/api/category_payments',
  model: OpenDisclosure.CategoryPayment
});
