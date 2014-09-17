OpenDisclosure.Views.Rules = Backbone.View.extend({
  template: HandlebarsTemplates['rules'],

  initialize: function(){
    this.render();
  },

  render: function() {
    this.$el.html(this.template());
  }
});
