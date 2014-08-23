OpenDisclosure.ContributorView = Backbone.View.extend({
  template: _.template(' \
    <div class="col-sm-6 contribution"><a href="<%= contribution.recipientLinkPath() %>">\
    <span class="col-sm-8"><%= contribution.attributes.recipient.name %></span>\
    <span class="col-sm-4"><%= OpenDisclosure.friendlyMoney(contribution.attributes.amount) %> </span>\
    </a></div>'),

  initialize: function(options) {
    this.options = options;
    this.render();
  },

  render: function() {
    this.$el.empty();

    $('<section>\
         <div class="col-sm-12">\
           <h1>' + this.collection[0].attributes.contributor.name + '</h1>\
         </div>\
         <div class="contributions clearfix"></div>\
       </section>').appendTo(this.$el);

    var that = this;
    _.each(this.collection, function( c ){
      $('.contributions').append(that.template({
        contribution: new OpenDisclosure.Contribution(c.attributes),
      }));
    });
  }
});
