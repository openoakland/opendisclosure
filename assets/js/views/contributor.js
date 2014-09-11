OpenDisclosure.Views.Contributor = Backbone.View.extend({
  template: HandlebarsTemplates['contributor'],

  initialize: function(options) {
    _.bindAll(this, 'render');

    this.options = options;

    this.collection = new OpenDisclosure.Contributors([], {
      contributor: this.options.contributorId,
      search: this.options.search
    });

    this.collection.fetch({ success: this.render });
  },

  contributorName: function() {
    return this.collection.at(0).get('contributor').name;
  },

  render: function() {
    if (this.collection.length === 0) {
      this.$el.empty();
      new OpenDisclosure.Search({
	el: this.$el,
      });

      return;
    }

    // group all contributions by contributor
    var groupedCollection = this.collection.groupBy(function(m) {
      return m.attributes.contributor.name;
    });

    this.$el.html(new OpenDisclosure.Search({ search : this.options.search }).$el);
    this.$el.append(this.template({
      // produce a mapping like:
      // {
      //   contributors: [{
      //     name: 'foobar baz',
      //     contributions: [{ ... }, ...],
      //   }, ...]
      // }
      contributors: _.map(groupedCollection, function(contributions, name) {
        return {
          name: name,
          contributions: _.map(contributions, function(contribution) {
            contribution = new OpenDisclosure.Contribution(contribution.attributes);

            return {
              recipientLinkPath: contribution.recipientLinkPath(),
              recipientName: contribution.attributes.recipient.name,
              amount: OpenDisclosure.friendlyMoney(contribution.get('amount')),
              date: moment(contribution.attributes.date).format("MMM-DD-YY")
            };
          })
        };
      })}
    ));
  }
});
