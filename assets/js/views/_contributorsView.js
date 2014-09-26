OpenDisclosure.ContributorsView = Backbone.View.extend({
  template: _.template('\
    <div class="col-sm-12">\
      <h2><%= headline %></h2>\
    </div>\
    <div class="contributions clearfix">\
    <%= contributions %>\
    </div>'),

  contributionTemplate: _.template('\
      <div class="col-sm-6 col-xs-12 contribution">\
        <a href="<%= contribution.contributorLinkPath() %>">\
          <span class="col-xs-6"><%= contribution.attributes.contributor.name %></span>\
          <span class="col-xs-2"><%= OpenDisclosure.friendlyMoney(contribution.attributes.amount) %><%= contribution.typeName() %></span>\
        </a>\
      </div>'),

  initialize: function(options) {
    this.headline = options.headline;

    _.bindAll(this, 'renderContribution');
    this.listenTo(this.collection, 'sync', this.render);

    if (this.collection.length > 0) {
      this.render();
    }
  },

  render: function() {
    this.$el.html(this.template({
      headline : this.headline,
      contributions : this.collection.map(this.renderContribution).join('')
    }));
  },

  renderContribution: function(contribution) {
    var contribution = new OpenDisclosure.Contribution(contribution.attributes);

    return this.contributionTemplate({
      contribution: contribution
    })
  }
});
