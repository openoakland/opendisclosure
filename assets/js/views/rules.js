OpenDisclosure.RulesView = Backbone.View.extend({

  template: _.template("\
		       <section id='rules'>\
		       <h1>Oakland Campaign Finance Rules<h1/>\
		       <p class='rules'>\
		       Any “person” may contribute up to $700* to each candidate per election cycle. “Broad-based political committees” may contribute up to $1400* to each candidate per election cycle (Oakland Campaign Reform Act (OCRA) 3.12.050).<p/>\
		       <p class='rules'>\
		       “Person” means an individual, proprietorship, firm, partnership, joint venture, syndicate, business, trust, company, corporation, association, committee, and any other organization or group of persons acting in concert (OCRA 3.12.040).<p/>\
		       <p class='rules'>\
		       ”Broad-based political committee” means a committee of persons which has been in existence for more than six months, receives contributions from one hundred (100) or more persons, and acting in concert makes contributions to five or more candidates (OCRA 3.12.040).<p/>\
		       <p class='rules'>\
		       *Candidates may accept this higher contribution limit ONLY IF they accept the OCRA expenditure ceilings by submitting the OCRA Form 301. If the candidate does not accept the expenditure ceilings then the limit for persons is $100 and the limit for broad-based political committees is $250.<p/>\
		       <p class='rules'>\
		       For more information on Oakland’s campaign finance rules, please review the Oakland Campaign Reform Act (OCRA) and the Public Ethics Commission’s Guide to OCRA.<p/>\
		       <p class='rules'>\
		       Contact the City of Oakland Public Ethics Commission with any questions at ethicscommission@oaklandnet.com or (510) 238-3593. <p/>\
		       <section/>\
     "),

  initialize: function(){
      this.render();
  },

  render: function(){
    $('.main').empty();
    $('.main').html(this.template());

  },

});
