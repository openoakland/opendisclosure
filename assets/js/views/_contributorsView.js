OpenDisclosure.ContributorsView = Backbone.View.extend({
  template: _.template('\
    <div class="col-sm-12">\
      <h2><%= headline %></h2>\
    </div>\
    <div class="contributions clearfix">\
      <div class="leftContributions col-sm-6"><%= leftContributions %></div>\
      <div class="rightContributions col-sm-6"><%= rightContributions %></div>\
    </div>'),

  contributionTemplate: _.template('\
      <div class="col-xs-12 contribution">\
        <a href="<%= contribution.contributorLinkPath() %>">\
          <span class="col-xs-6"><%= contribution.attributes.contributor.name %></span>\
          <span class="col-xs-2"><%= OpenDisclosure.friendlyMoney(contribution.attributes.amount) %><%= contribution.typeName() %></span>\
          <span class="col-xs-4"><%= contribution.attributes.date ? moment(contribution.attributes.date).format("MMM-DD-YY"): "" %></span>\
        </a>\
      </div>'),

  contributionTemplateNoDate: _.template('\
      <div class="col-xs-12 contribution">\
        <a href="<%= contribution.contributorLinkPath() %>">\
          <span class="col-xs-6"><%= contribution.attributes.contributor.name %></span>\
          <span class="col-xs-6"><%= OpenDisclosure.friendlyMoney(contribution.attributes.amount) %><%= contribution.typeName() %></span>\
        </a>\
      </div>'),

  initialize: function(options) {
    this.headline = options.headline;
    this.showDate = options.showDate;

    _.bindAll(this, 'renderContribution');
    this.listenTo(this.collection, 'sync', this.render);

    if (this.collection.length > 0) {
      this.render();
    }
  },

  render: function() {
    var half  = Math.round(this.collection.length/2);
    var left  = this.collection.toArray().slice(0,half-1);
    var right = this.collection.toArray().slice(half,-1);

    this.$el.html(this.template({
      headline : this.headline,
      leftContributions : left.map(this.renderContribution).join(''),
      rightContributions : right.map(this.renderContribution).join('')
    }));
  },

  renderContribution: function(contribution) {
    var contribution = new OpenDisclosure.Contribution(contribution.attributes);
    var renderedContributions = '';
    if (this.showDate) {
      renderedContributions = this.contributionTemplate({
        contribution: contribution
      })
    } else {
      renderedContributions = this.contributionTemplateNoDate({
        contribution: contribution
      })
    }

    return renderedContributions;
  }
});
