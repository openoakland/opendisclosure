OpenDisclosure.Views.IECView = Backbone.View.extend({

  template: _.template('\
      <div class="col-xs-12 contribution">\
          <span class="col-xs-2"><%= attributes.date ? moment(attributes.date).format("MMM-DD-YY"): "" %></span>\
          <span class="col-xs-2"><%= attributes.support ? "Supporting" : "Opposing" %></span>\
	  <a href="<%= recipientLinkPath() %>">\
	    <span class="col-xs-6"><%= attributes.recipient.name %></span>\
	  </a>\
          <span class="col-xs-2"><%= OpenDisclosure.friendlyMoney(attributes.amount) %></span>\
      </div>\
      <div class="col-xs-12 description">\
      	<span class="col-xs-4"></span>\
	<span class="col-xs-8"><%= attributes.description %></span>\
      </div>'),

  header: _.template('\
      <div class="col-sm-12">\
        <h3><%= contributorName %></h3>\
      </div>'),

  initialize: function(options) {
    this.options = options;

    _.bindAll(this, 'renderExpenditure');

    if (this.collection.length > 0) {
      this.render();
    }
    this.listenTo(this.collection, 'sync', this.render);

  },

  render: function() {
    this.$el.empty();
    $('<h1>Independent Commitee Expenditures</h1>').appendTo(this.$el);
    $('<h5 class="footnote">Not controlled by candidates. <a href="/faq#iec">See FAQ.</a></h5>').appendTo(this.$el);
    if (this.collection.length == 0) {
      return
    }
    this.name = "";
    this.$el.append(this.collection.map(this.renderExpenditure).join(' '));
  },

  renderExpenditure: function(c) {
    ret = "";
    if (c.attributes.contributor.name != this.name) {
      this.name = c.attributes.contributor.name;
      ret = this.header({ contributorName: this.name });
    }
    contribution = new OpenDisclosure.Contribution(c.attributes);
    return ret + this.template(contribution);

  }
});
