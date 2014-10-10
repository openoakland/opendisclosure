OpenDisclosure.TopContributorsView = Backbone.View.extend({
  template: _.template(' \
    <div class="col-sm-12">\
      <a href="<%= employerLinkPath() %>">\
        <span class="col-xs-8"><%= attributes.contrib %></span>\
        <span class="col-xs-4"><%= OpenDisclosure.friendlyMoney(attributes.amount) %> </span>\
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
        <div class="topContributions clearfix">\
        <div class="col-sm-6 leftCol"></div>\
        <div class="col-sm-6 rightCol"></div>\
      </div>')
    .appendTo(this.$el);

    var half  = Math.round(this.collection.length/2);
    var left  = this.collection.slice(0,half);
    var right = this.collection.slice(half);

    this.$el.find('.leftCol').html(
      _.map(left, function(c) {
        return this.template(c);
      }.bind(this))
    );

    this.$el.find('.rightCol').html(
      _.map(right, function(c) {
        return this.template(c);
      }.bind(this))
    );

    this.$el.append("<h5 class='footnote'>For more Details on how we group businesses and employers see the <a href='/faq#groupBy'>FAQ</a></h5>");
  },

});
