OpenDisclosure.CandidateTable = Backbone.View.extend({
  template: _.template($('#mayoral-table-template').html()),

  initialize : function() {
    if (this.collection.length > 0) {
      this.render();
    }
    this.listenTo(this.collection, 'sync', this.render);
  },

  render : function() {
    var candidates = _.partition(this.collection.models, function(m) {
      return m.attributes.summary;
    });

    this.$el.html(this.template({
      candidatesWithData : candidates[0],
      candidatesWithoutData : candidates[1]
    }));
  },
});
