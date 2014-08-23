OpenDisclosure.MultiplesView = Backbone.View.extend({

  template: _.template('\
    <div class="col-sm-6 contribution"><a href="<%= contributor.linkPath() %>">\
    <span class="col-sm-8"><%= contributor.attributes.name %></span>\
    <span class="col-sm-4"><%= number %> candidates </span>\
    </a></div>'),

  initialize: function(options) {
    this.options = options;

    _.bindAll(this, 'renderContributor');

    this.render();
  },

  render: function() {
    this.$el.empty();
    $('<section>\
         <div class="col-sm-12">\
           <h2>Contributors Who Gave to More Than One Mayoral Candidate</h2>\
         </div>\
         <div class="multples clearfix"></div>\
      </div>\
      </section>').appendTo(this.$el);

    this.$el.append(_.map(this.collection, this.renderContributor).join(' '));
  },

  renderContributor: function(c) {
    var contributor = new OpenDisclosure.Contributor(c.attributes.contributor);

    return this.template({
      number: c.attributes.number,
      contributor: contributor
    });
  }
});
