OpenDisclosure.MultiplesView = Backbone.View.extend({

  template: _.template('\
    <div class="col-sm-6 col-xs-12 contribution"><a href="<%= contributor.linkPath() %>">\
    <span class="col-xs-6"><%= contributor.attributes.name %></span>\
    <span class="col-xs-6"><%= number %> candidates </span>\
    </a></div>'),

  initialize: function(options) {
    this.options = options;

    _.bindAll(this, 'renderContributor');

    this.listenTo(this.collection, 'sync', this.render);

    if (this.collection.length > 0) {
      this.render();
    }
  },

  render: function() {
    this.$el.empty();
    $('<h2>Contributors Who Gave to More Than One Mayoral Candidate</h2>').appendTo(this.$el);

    this.$el.append(this.collection.map(this.renderContributor).join(' '));
  },

  renderContributor: function(c) {
    var contributor = new OpenDisclosure.Contributor(c.attributes.contributor);

    return this.template({
      number: c.attributes.number,
      contributor: contributor
    });
  }
});
