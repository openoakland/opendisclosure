window.OpenDisclosure = {};

OpenDisclosure.Candidate = Backbone.Model.extend({
  imagePath : function() {
    return '/images/' + this.attributes.short_name.split(' ').slice(-1) + '.png';
  },

  pctContributionsFromOakland : function() {
    return this.friendlyPct(1 - this.attributes.received_contributions_from_oakland /
                            this.attributes.received_contributions_count);
  },

  friendlySummaryNumber : function(which) {
    return this.friendlyNumber(this.attributes.latest_summary[which]);
  },

  friendlyNumber : function(number) {
    return "$" + number;
  },

  friendlyPct : function(float) {
    return Math.round(float * 100) / 100 + "%";
  }
});

OpenDisclosure.CandidateCollection = Backbone.Collection.extend({
  url: '/api/candidates',
  model: OpenDisclosure.Candidate
});

OpenDisclosure.CandidateTable = Backbone.View.extend({
  el : '#mayoral-candidates',

  initialize : function() {
    this.template = _.template($('#mayoral-table-template').html());
    this.render();
  },

  render : function() {
    this.$el.html(this.template(this.collection));
  },
});

OpenDisclosure.App = Backbone.Router.extend({
  initialize : function() {
    console.log('Fetching data from /api/candidates...');
    this.candidateList = new OpenDisclosure.CandidateCollection();
    this.candidateList.fetch();

    this.listenTo(this.candidateList, 'sync', function() {
      console.log('Received candidate data!');
      new OpenDisclosure.CandidateTable({ collection : this.candidateList });
    });
  },
});

new OpenDisclosure.App();
