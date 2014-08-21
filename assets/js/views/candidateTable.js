OpenDisclosure.CandidateTable = Backbone.View.extend({
  template: _.template($('#mayoral-table-template').html()),

  initialize : function() {
    if (this.collection.loaded) {
      this.render();
    } else {
      this.listenTo(this.collection, 'sync', function() {
        console.log('Received candidate data!');
        this.render();
      });
    }
  },

  render : function() {
    this.$el.html(this.template(this.collection));
  },
});
