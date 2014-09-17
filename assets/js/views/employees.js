OpenDisclosure.Views.Employees = Backbone.View.extend({

  template: HandlebarsTemplates['employees'],

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

    contribution.friendlyAmount = OpenDisclosure.friendlyMoney(contribution.attributes.amount);

    contribution.friendlyDate = moment(contribution.attributes.date).format("MMM-DD-YY");

    contribution.calculatedLink = contribution.recipientLinkPath();

    return this.template({ contribution: contribution });
  }
});
