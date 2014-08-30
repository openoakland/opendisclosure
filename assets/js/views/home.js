OpenDisclosure.Views.Home = Backbone.View.extend({
  initialize : function() {
    this.render();
  },

  render : function() {
    this.$el.html('<section id="candidateTable"></section>\
       <section id="search"></section> \
       <section id="zipcodeChart"></section> \
      <section id="dailyChart"></section> \
       <section id="topContributions"></section> \
       <section class="clearfix" id="multiples"></section>');

    //TODO: add this back into the above template when the chart is ready

    new OpenDisclosure.CandidateTable({
      el : '#candidateTable',
      collection : OpenDisclosure.Data.candidates
    });

    new OpenDisclosure.Search({
      el : '#search'
    });

    new OpenDisclosure.ZipcodeChartView({
      el : '#zipcodeChart',
      collection : OpenDisclosure.Data.contributions,
      base_height: 480
    });

    new OpenDisclosure.DailyContributionsChartView({
      el : "#dailyChart",
      collection: OpenDisclosure.Data.contributions,
      base_height: 480
    });

    new OpenDisclosure.ContributorsView({
      el : '#topContributions',
      collection : OpenDisclosure.Data.whales,
      headline :'Top Contributors To All Candidates in This Election'
    });

    new OpenDisclosure.MultiplesView({
      el : '#multiples',
      collection: OpenDisclosure.Data.multiples,
      headline: 'Contributors To More Than One Mayoral Candidate'
    });

  }
});
