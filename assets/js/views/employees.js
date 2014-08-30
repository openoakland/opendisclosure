OpenDisclosure.Views.Employees = Backbone.View.extend({
  template: _.template(' \
    <div id="contirbutor">\
    <div class="row""><a href="<%= contribution.recipientLinkPath() %>">\
    <span class="col-sm-3"><%= contribution.attributes.contributor.name %></span>\
    <span class="col-sm-6"><%= contribution.attributes.recipient.name %></span>\
    <span class="col-sm-1"><%= OpenDisclosure.friendlyMoney(contribution.attributes.amount) %> </span>\
    <span class="col-sm-2"><%= moment(contribution.attributes.date).format("MMM-DD-YY") %></span>\
                       </a></div></div>'),

  initialize: function(options) {
    _.bindAll(this, 'render', 'renderContribution');

    this.options = options;
    this.collection = new OpenDisclosure.Employees([], { employer_id: this.options.employer_id } );
    this.collection.fetch({ success: this.render });

  },

  render: function() {
    this.$el.html('<div id="search"></div>\
		  <h2>' + this.options.headline + '</h2>\
		  <div class="data"></div>');

    new OpenDisclosure.Search({
      el : "#search"
    });

    if (this.collection.length > 0) {
      this.$('.data').html(this.collection.map(this.renderContribution));
    } else {
      this.$('.data').empty();
    }

  },

  renderContribution: function(c) {
    var contribution = new OpenDisclosure.Contribution(c.attributes);

    return this.template({ contribution: contribution });
  }
});
