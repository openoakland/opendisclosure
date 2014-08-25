OpenDisclosure.ContributorView = Backbone.View.extend({
  template: _.template(' \
    <div class="col-sm-6 contribution"><a href="<%= contribution.recipientLinkPath() %>">\
    <span class="col-sm-8"><%= contribution.attributes.recipient.name %></span>\
    <span class="col-sm-4"><%= OpenDisclosure.friendlyMoney(contribution.attributes.amount) %> </span>\
    </a></div>'),

  initialize: function(options) {
    this.options = options;

    _.bindAll(this, 'renderContribution');

    this.listenTo(this.collection, 'sync', this.render);

    if (this.collection.length > 0) {
      this.render();
    }
  },

  contributorName: function() {
    return this.collection.at(0).get('contributor').name;
  },

  render: function() {
    console.log(this.collection);
    this.$el.html('<section>\
         <div class="col-sm-12">\
           <h1>' + this.contributorName() + '</h1>\
         </div>\
         <div class="contributions clearfix"></div>\
       </section>');

    this.$('.contributions').html(this.collection.map(this.renderContribution));
  },

  renderContribution: function(c) {
    var contribution = new OpenDisclosure.Contribution(c.attributes);

    return this.template({ contribution: contribution });
  }
});
