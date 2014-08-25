OpenDisclosure.Views.Home = Backbone.View.extend({
  initialize : function() {
    this.render();
  },

  render : function() {
    this.$el.html('<div id="candidateTable"></div>\
       <div id="zipcodeChart"></div> \
       <div id="dailyChart"></div> \
       <div id="topContributions"></div> \
       <div id="multiples"></div>')

    new OpenDisclosure.CandidateTable({
      el : '#candidateTable',
      collection : OpenDisclosure.Data.candidates
    });

    new OpenDisclosure.ZipcodeChartView({
      el : '#zipcodeChart',
      collection : OpenDisclosure.Data.contributions,
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

    // Temporarily disabled until the black-background bug is fixed:
    //
    // new OpenDisclosure.DailyContributionsChartView({
    //   el : "#dailyChart",
    //   collection: this.contributions,
    //   base_height: 480
    // })
  }
});
