OpenDisclosure.CandidateTable = Backbone.View.extend({
  el : '#mayoral-candidates',
  template: _.template($('#mayoral-table-template').html()),

  initialize : function() {
    this.listenTo(this.collection, 'sync', function() {
      console.log('Received candidate data!');
      this.render();
    });
  },
  render : function() {
    this.$el.html(this.template(this.collection));
  },
});