OpenDisclosure.CandidateTable = Backbone.View.extend({
  template: _.template($('#mayoral-table-template').html()),

  initialize : function() {
    if (this.collection.length > 0) {
      this.render();
    }
    this.listenTo(this.collection, 'sync', this.render);
  },

  render : function() {
    this.$el.html(this.template(this.collection));
  },
});
