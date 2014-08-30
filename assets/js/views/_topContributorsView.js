OpenDisclosure.TopContributorsView = Backbone.View.extend({
  template: _.template(' \
    <div class="col-sm-6">\
      <a href="<%= employerLinkPath() %>">\
	<span class="col-sm-8"><%= attributes.contrib %></span>\
	<span class="col-sm-4"><%= OpenDisclosure.friendlyMoney(attributes.amount) %> </span>\
      </a>\
    </div>'),

  initialize: function() {
    this.render();
  },

  render: function() {
    this.$el.empty();
    $('<h2>Top Contributions (employees grouped with their employer)</h2>\
      <div class="topContributions clearfix"></div>')
    .appendTo(this.$el);
    var that = this;
    _.each(this.collection, function(c){
      that.$el.find('.topContributions').append(that.template(c));
    });
  },

});
