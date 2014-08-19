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
  },

  home: function(){
    $('.main').empty();
    $('<div id="candidateTable"></div> \
       <div id="zipcodeChart"></div> \
       <div id="dailyChart"></div> \
       <div id="topContributions"></div> \
       <div id="multiples"></div> \
    ').appendTo('.main');
    new OpenDisclosure.CandidateTable({el : '#candidateTable',
				      collection : this.candidates});

    doChart = function(that){
      new OpenDisclosure.ZipcodeChartView({el : '#zipcodeChart',
					  collection : that.contributions,
					  base_height: 480
      });
      new OpenDisclosure.DailyContributionsChartView({el : "#dailyChart",
						     collection: that.contributions,
						     base_height: 480 })
    }
    if (this.contributions.loaded)
      doChart(this);
    else
      this.listenTo(this.contributions, 'sync', function() {
	doChart(this);
      });

    doWhalesView = function(that){
      new OpenDisclosure.ContributorsView({el : '#topContributions',
					  collection : that.whales.models,
					  headline :'Top Contributors To All Candidates in This Election'});
    }
    if (this.whales.loaded)
      doWhalesView(this);
    else
      this.listenTo(this.whales, 'sync', function() {
	console.log('Received whale data!');
	doWhalesView(this);
      });

    doMultiView = function (that) {
      new OpenDisclosure.MultiplesView({el : '#multiples',
				       collection: that.multiples.models,
				       headline:'Contributors To More Than One Mayoral Candidate'});
    };
    if (this.multiples.loaded)
      doMultiView(this);
    else
      this.listenTo(this.multiples, 'sync', function() {
        console.log('Received multiples data!');
        doMultiView(this);
      });
  },

  about: function () {
    new OpenDisclosure.AboutView();
  },

  rules: function () {
    new OpenDisclosure.RulesView();
  },

  candidate: function(id){
    $('.main').empty();
    $('<div id="candidate"></div>').appendTo('.main');
    doView = function(that) {
      new OpenDisclosure.CandidateView({el: '#candidate',
				       model: that.candidates.get(id)});
    }
    if (this.candidates.loaded)
      doView(this);
    else
      this.listenTo(this.candidates, 'sync', function() {
	doView(this);
      });
  },

  contributor : function(id) {
    $('.main').empty();
    $('<div id = "contirbutor"></div> \
    ').appendTo('.main');
    var contrib = new OpenDisclosure.Contributors({contributor: id} );
    this.listenTo(contrib, 'sync', function() {
      new OpenDisclosure.ContributorView({el: '#contirbutor', collection: contrib.models});
    });
  }

});

$(function(){
  app = new OpenDisclosure.App();
  Backbone.history.start();
});
