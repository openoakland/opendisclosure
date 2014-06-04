OpenDisclosure.CandidateView = Backbone.View.extend({

  template: _.template("<section id='candidate'>\
      <h1><%= short_name %></h1>\
      <div class='row'>\
        <div class='col-sm-4'>\
          <img class='mayor-picture' src='<%= imagePath %>' /> \
        </div>\
        <div class='col-sm-4'>\
          <p><%= name %></p>\
          <p>Party Affiliation: <%= party_affiliation %></p>\
          <p><%= profession %></p>\
        </div>\
        <div class='col-sm-4'>\
          <% if (typeof summary !== 'undefined') { %>\
          <p>Total Raised: $ <%= summary.total_contributions_received %></p>\
          <p>Total Expenditures: $<%= summary.total_expenditures_made %></p>\
          <p>Ending Cash On Hand: $<%= summary.ending_cash_balance %></p>\
          <p>Last Updated: <%= summary.last_summary_date %> </p>\
          <% } %>\
        </div>\
      </div>\
    </section>\
    <section>\
      <h2>Contributions</h2>\
      <div class='contributions clearfix'></div>\
    </section>"),

  initialize: function(){
    // debugger;
    this.model.attributes.imagePath = this.model.imagePath();
    this.render();
  },

  render: function(){
    $('#mayoral-candidates').html(this.template(this.model.attributes));
    $('#charts').parent().html('');
    $('.sidebar li').removeClass('active');
    $('#nav-'+this.model.attributes.id).addClass('active');
  }

});
