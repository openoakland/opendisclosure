window.OpenDisclosure = {};

OpenDisclosure.Candidate = Backbone.Model.extend({
  friendlySummaryNumber : function(which) {
    return this.friendlyNumber(this.attributes.latest_summary[which]);
  },

  friendlyNumber : function(number) {
    return "$" + number;
  }
});

OpenDisclosure.CandidateCollection = Backbone.Collection.extend({
  url: '/api/candidates',
  model: OpenDisclosure.Candidate
});

OpenDisclosure.CandidateTable = Backbone.View.extend({
  el : '#mayoral-table',

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
