OpenDisclosure.TopContributorsView = Backbone.View.extend({
  template: _.template(' \
    <div class="col-sm-6">\
      <a href="<%= employerLinkPath() %>">\
	<span class="col-sm-8"><%= attributes.contrib %></span>\
	<span class="col-sm-4"><%= OpenDisclosure.friendlyMoney(attributes.amount) %> </span>\
      </a>\
    </div>'),

  initialize: function(options) {
    this.options = options;
    this.render();
  },

  render: function() {
    this.$el.empty();
    $('<h2>Top Contributors to ' + this.options.candidate + '</h2>\
      <h4>employees grouped with their employer</h4>\
      <div class="topContributions clearfix"></div>')
    .appendTo(this.$el);
    var that = this;
    _.each(this.collection, function(c){
      that.$el.find('.topContributions').append(that.template(c));
    });

    this.$el.append("<h5 class='footnote'>For more Details on how we group businesses and employers see the <a href='/faq#groupBy'>FAQ</a></h5>");
  },

});
