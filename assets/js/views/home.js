OpenDisclosure.Views.Home = Backbone.View.extend({
  initialize : function() {
    this.render();
  },

  render : function() {
    this.$el.html('<section id="candidateTable"></section>\
      <section class="col-sm-12">\
	<span id="search" class="col-sm-6"></span>\
	<span id="committee" class="col-sm-6"></span>\
	<h5>For information on searching <a href="/faq#search">see the FAQ</a><h5>\
      </section>\
      <section id="zipcodeChart"></section> \
      <section id="dailyChart"></section> \
      <section id="topContributions"></section> \
      <section class="clearfix" id="multiples"></section>');

    //TODO: add this back into the above template when the chart is ready
    // <section id="dailyChart"></section> \

    new OpenDisclosure.CandidateTable({
      el : '#candidateTable',
      collection : OpenDisclosure.Data.candidates
    });

    new OpenDisclosure.Search({
      el : '#search'
    });

    new OpenDisclosure.CommitteeSearch({
      el : '#committee'
    });

    OpenDisclosure.Data.zipContributions.done(function(data) {
      new OpenDisclosure.ZipcodeChartView({
        el : '#zipcodeChart',
        collection : data,
        base_height: 480
      });
    });


    // TODO: This is commented out until it uses the data format returned by
    // /api/contributions/by_date and that API endpoint is created.
    //
    OpenDisclosure.Data.dailyContributions.done(function(data) {
      new OpenDisclosure.DailyContributionsChartView({
        el : "#dailyChart",
        collection: data,
        base_height: 480
      });
    });

    new OpenDisclosure.ContributorsView({
      el : '#topContributions',
      collection : OpenDisclosure.Data.whales,
      headline :'Top Contributors To All Candidates in This Election',
      showDate : false
    });

    new OpenDisclosure.MultiplesView({
      el : '#multiples',
      collection: OpenDisclosure.Data.multiples,
      headline: 'Contributors To More Than One Mayoral Candidate'
    });

  }
});
