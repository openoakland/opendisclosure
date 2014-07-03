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
        </div>\
        <div class='col-sm-4'>\
          <% if (typeof attributes.summary !== 'undefined') { %>\
          <p>Total Raised:  <%= friendlySummaryNumber('total_contributions_received') %></p>\
          <p>Total Expenditures: <%= friendlySummaryNumber('total_expenditures_made') %></p>\
          <p>Ending Cash On Hand: <%= friendlySummaryNumber('ending_cash_balance') %></p>\
          <p>Last Updated: <%= attributes.summary.last_summary_date %> </p>\
          <% } %>\
      </section>\
     "),

  initialize: function(){
    if (this.model) {
      this.model.attributes.imagePath = this.model.imagePath();
      this.render();}
    else { 
      app.navigate('home',true)
    }
  },

  render: function(){
    this.updateNav();
    $('.main').html(this.template(this.model));

    // Render Category chart
    var that = this;
    this.categories = _.filter(app.categoryContributions.models, function(c) {
      return c.attributes.recipient_id == that.model.attributes.id;
    });

    new OpenDisclosure.CategoryView({collection: this.categories, summary: this.model.attributes.summary});

    // Render Top Contributions
    var that = this;
    var count = 0;
    this.topContributions = _.filter(app.employerContributions.models, function(c) {
      return c.attributes.recipient_id == that.model.attributes.id && ++count <= 10;
    });

    new OpenDisclosure.TopContributorsView({collection: this.topContributions});

    // Render Contributions
    this.filteredContributions = _.filter(app.contributions.models, function(c) {
      return c.attributes.recipient.id == that.model.attributes.id;
    });

    new OpenDisclosure.ContributorsView({collection: this.filteredContributions, headline: 'Contributions'});

  },

  updateNav: function(){
    //Update Nav
    $('.sidebar li').removeClass('active');
    $('#nav-'+this.model.attributes.id).addClass('active');
  }
});