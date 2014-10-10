OpenDisclosure.TopContributorsView = Backbone.View.extend({
  template: _.template(' \
    <div class="col-sm-6 col-xs-12">\
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
        <div class="leftCol col-sm-6"></div>\
        <div class="rightCol col-sm-6"></div>\
      </div>')
    .appendTo(this.$el);

    var that = this;
    var half  = Math.round(this.collection.length/2);
    var left  = this.collection.slice(0,half);
    var right = this.collection.slice(half);
    _.each(left, function(c){
      that.$el.find('.topContributions .leftCol').append(that.template(c));
    });
    _.each(right, function(c){
      that.$el.find('.topContributions .rightCol').append(that.template(c));
    });

    this.$el.append("<h5 class='footnote'>For more Details on how we group businesses and employers see the <a href='/faq#groupBy'>FAQ</a></h5>");
  },

});
