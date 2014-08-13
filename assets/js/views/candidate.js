OpenDisclosure.CandidateView = Backbone.View.extend({

  template: _.template("<section id='candidate'>\
    <h1><%= attributes.short_name %></h1>\
      <section class='row candidate'>\
        <div class='col-sm-4'>\
          <img class='mayor-picture' src='<%= attributes.imagePath %>' /> \
        </div>\
        <div class='col-sm-4'>\
          <p><%= name %></p>\
          <p>Party Affiliation: <%= attributes.party_affiliation %></p>\
          <p><%= attributes.profession %></p>\
          <p><a id='twitter' href='https://twitter.com/'+ <%= attributes.twitter %>><%= attributes.twitter %></a></p>\
          <p><%= attributes.bio %></p>\
        </div>\
        <div class='col-sm-4'>\
          <% if (typeof attributes.summary !== 'undefined') { %>\
          <p>Total Raised:  <%= friendlySummaryNumber('total_contributions_received') %></p>\
          <p>Total Expenditures: <%= friendlySummaryNumber('total_expenditures_made') %></p>\
          <p>Ending Cash On Hand: <%= friendlySummaryNumber('ending_cash_balance') %></p>\
          <p>Last Updated: <%= attributes.summary.last_summary_date %> </p>\
          <% } %>\
      </section>\
      <section><div id = 'category'></div></section>\
      <section><div id = 'topContributors'></div></section>\
      <section><div id = 'contributors'></div></section>\
     "),

  initialize: function(){
    if (this.model) {
      this.model.attributes.imagePath = this.model.imagePath();
      this.render();}
    else {
      app.navigate('',true);
    }
  },

  render: function(){
    this.updateNav();
    this.$el.html(this.template(this.model));

    // Render Category chart
    var categories = function(that) {
      that.categories = _.filter(app.categoryContributions.models, function(c) {
	return c.attributes.recipient_id == that.model.attributes.id;
      });

      new OpenDisclosure.CategoryView({el: '#category', collection: that.categories,
				      summary: that.model.attributes.summary});
    };
    if (app.categoryContributions.loaded)
      categories(this);
    else
      this.listenTo(app.categoryContributions, 'sync', function() {
	categories(this);
      });

    var topContributions = function(that) {
      // Render Top Contributions
      var count = 0;
      that.topContributions = _.filter(app.employerContributions.models, function(c) {
	return c.attributes.recipient_id == that.model.attributes.id;
      }).sort(function(a, b){return b.attributes.amount - a.attributes.amount});
      that.topContributions = _.filter(that.topContributions, function() { return count++ < 10; });

      new OpenDisclosure.TopContributorsView({el: "#topContributors",
					     collection: that.topContributions});

    }
    if (app.employerContributions.loaded)
      topContributions(this);
    else
      this.listenTo(app.employerContributions, 'sync', function() {
	topContributions(this);
      });

    // Render Contributions
    var contributions = function(that) {
      this.filteredContributions = _.filter(app.contributions.models, function(c) {
	return c.attributes.recipient.id == that.model.attributes.id;
      });

      new OpenDisclosure.ContributorsView({el: "#contributors",
					  collection: this.filteredContributions,
					  headline: 'Contributions'});
    }

    if (app.contributions.loaded)
      contributions(this);
    else
      this.listenTo(app.contributions, 'sync', function() {
	contributions(this);
      });

  },

  updateNav: function(){
    //Update Nav
    $('.sidebar li').removeClass('active');
    $('#nav-'+this.model.attributes.id).addClass('active');
  }
});
