OpenDisclosure.Views.Faq = Backbone.View.extend({

  template: HandlebarsTemplates['faq'],

  initialize: function(options) {
    this.render();
  },

  render: function() {
    this.$el.html(this.template());
  }

});
