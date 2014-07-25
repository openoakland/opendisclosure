OpenDisclosure.App = Backbone.Router.extend({
  routes: {
    '': 'home',
    'about': 'about',
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
    $('#bodyContainer').empty();
    $('<div id="candidateTable"></div> \
       <div id="zipcodeChart"></div> \
       <div id="dailyChart"></div> \
       <div id="topContributions"></div> \
       <div id="multiples"></div> \
    ').appendTo('#bodyContainer');
    new OpenDisclosure.CandidateTable({el : '#candidateTable',
				      collection : this.candidates});
    new OpenDisclosure.ZipcodeChartView({el : '#zipcodeChart',
					collection : this.contributions,
					base_height: 480
    });
    new OpenDisclosure.DailyContributionsChartView({el : "#dailyChart",
						   collection: this.contributions,
						   base_height: 480 })
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
    }
    if (this.multiples.loaded)
      doMultiView(this);
    else
      this.listenTo(this.multiples, 'sync', function() {
	console.log('Received multiples data!');
	doMultiView(this);
      });
  },

  candidate: function(id){
    if (!this.candidates){ this.candidates = new OpenDisclosure.Candidates();}
    this.currentCandidate = this.candidates.get(id);
    new OpenDisclosure.CandidateView({model: this.currentCandidate});

    // Render Top Contributions
    var that = this;
    var count = 0;
    this.topContributions = _.filter(this.employerContributions.models, function(c) {
      return c.attributes.recipient_id == that.currentCandidate.id && ++count <= 10;
    })
    new OpenDisclosure.DailyContributionsChartView({
      collection: this.contributions,
      base_height: 480
    });
  },

  about: function () {
    new OpenDisclosure.AboutView();
  },

  candidate: function(id){
    $('#bodyContainer').empty();
    $('<div id="candidate"></div>').appendTo('#bodyContainer');
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
    $('#bodyContainer').empty();
    $('<div id = "contirbutor"></div> \
    ').appendTo('#bodyContainer');
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
