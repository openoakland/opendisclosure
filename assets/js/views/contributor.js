OpenDisclosure.Views.Contributor = Backbone.View.extend({
  template: _.template(' \
    <div id="contirbutor">\
    <div class="col-sm-6 contribution"><a href="<%= contribution.recipientLinkPath() %>">\
    <span class="col-sm-8"><%= contribution.attributes.recipient.name %></span>\
    <span class="col-sm-4"><%= OpenDisclosure.friendlyMoney(contribution.attributes.amount) %> </span>\
                       </a></div></div>'),

  initialize: function(options) {
    _.bindAll(this, 'render', 'renderContribution');

    this.options = options;

    this.collection = new OpenDisclosure.Contributors([], {
      contributor: this.options.contributorId
    });
    this.collection.fetch({ success: this.render });
  },

  contributorName: function() {
    return this.collection.at(0).get('contributor').name;
  },

  render: function() {
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
