OpenDisclosure.TopContributorsView = Backbone.View.extend({
  template: _.template(' \
    <div class="col-sm-6">\
    <span class="col-sm-8"><%= contrib %></span>\
    <span class="col-sm-4"><%= OpenDisclosure.friendlyMoney(amount) %> </span>\
    </div>'),

  initialize: function() {
    this.render();
  },

  render: function() {
    this.$el.empty();
    $('<h2>Top Contributors</h2>\
      <h4> by Employer/Business</h4>\
      <div class="topContributions clearfix"></div>')
    .appendTo(this.$el);
    var that = this;
    _.each(this.collection, function(c){
      that.$el.find('.topContributions').append(that.template(c.attributes));
    });
  },

});
