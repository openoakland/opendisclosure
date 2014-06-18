OpenDisclosure.CandidateView = Backbone.View.extend({

  template: _.template("<section id='candidate'>\
      <h1><%= attributes.short_name %></h1>\
      <div class='row candidate'>\
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
        </div>\
     "),

  initialize: function(){
    // debugger;
    this.model.attributes.imagePath = this.model.imagePath();
    this.render();
  },

  render: function(){
    $('#mayoral-candidates').html(this.template(this.model));
    $('#charts').parent().html('');
    $('.sidebar li').removeClass('active');
    $('#nav-'+this.model.attributes.id).addClass('active');
  }

});
