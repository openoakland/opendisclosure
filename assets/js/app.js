OpenDisclosure.App = Backbone.Router.extend({
  routes: {
    '': 'home',
    'about': 'about',
    'rules': 'rules',
    'candidate/:id': 'candidate',
    'contributor/:id': 'contributor'
  },

  initialize : function() {
    this.candidates = new OpenDisclosure.Candidates();
    this.contributions = new OpenDisclosure.Contributions();
    this.employerContributions = new OpenDisclosure.EmployerContributions();
    this.categoryContributions = new OpenDisclosure.CategoryContributions();
    this.whales = new OpenDisclosure.Whales();
    this.multiples = new OpenDisclosure.Multiples();

    this.candidates.fetch();
    this.employerContributions.fetch();
    this.categoryContributions.fetch();
    this.whales.fetch();
    this.multiples.fetch();
    this.contributions.fetch();
  },

  home: function(){
    $('.main').empty();
    $('<div id="candidateTable"></div> \
       <div id="zipcodeChart"></div> \
       <div id="dailyChart"></div> \
       <div id="topContributions"></div> \
       <div id="multiples"></div> \
    ').appendTo('.main');

    new OpenDisclosure.CandidateTable({
      el : '#candidateTable',
      collection : this.candidates
    });

    new OpenDisclosure.ZipcodeChartView({
      el : '#zipcodeChart',
      collection : this.contributions,
      base_height: 480
    });

    new OpenDisclosure.ContributorsView({
      el : '#topContributions',
      collection : this.whales,
      headline :'Top Contributors To All Candidates in This Election'
    });

    new OpenDisclosure.MultiplesView({
      el : '#multiples',
      collection: this.multiples,
      headline: 'Contributors To More Than One Mayoral Candidate'
    });

    // Temporarily disabled until the black-background bug is fixed:
    //
    // new OpenDisclosure.DailyContributionsChartView({
    //   el : "#dailyChart",
    //   collection: that.contributions,
    //   base_height: 480
    // })
  },

  about: function () {
    new OpenDisclosure.AboutView();
  },

  rules: function () {
    new OpenDisclosure.RulesView();
  },

  candidate: function(name){
    $('.main').html('<div id="candidate"></div>');

    var createView = function() {
      var shortNameMatches = function(c) {
        return c.linkPath().indexOf(name) >= 0;
      };
      var candidate = this.candidates.find(shortNameMatches);

      if (candidate) {
        new OpenDisclosure.CandidateView({ el: '#candidate', model: candidate });
      }
    }.bind(this);

    if (this.candidates.length > 0) {
      createView();
    }

    this.listenTo(this.candidates, 'sync', createView);
  },

  contributor : function(id) {
    $('.main').html('<div id="contirbutor"></div>');

    var contributors = new OpenDisclosure.Contributors([], {
      contributor: id
    });
    contributors.fetch();

    new OpenDisclosure.ContributorView({
      el: '#contirbutor',
      collection: contributors
    });
  }

});

$(function(){
  app = new OpenDisclosure.App();
  Backbone.history.start({ pushState: true });

  $(document).click(function(e) {
    var $link = $(e.target).closest('a');

    if ($link.length) {
      var linkUrl = $link.attr('href'),
          externalUrl = linkUrl.indexOf('http') === 0,
          dontIntercept = e.altKey || e.ctrlKey || e.metaKey || e.shiftKey;

      if (externalUrl || dontIntercept) {
        return;
      }

      app.navigate(linkUrl.replace(/^\//,''), { trigger: true });
      e.preventDefault();
    }
  });
});
