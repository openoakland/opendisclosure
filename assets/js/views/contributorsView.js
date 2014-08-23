OpenDisclosure.ContributorsView = Backbone.View.extend({
  template: _.template('\
    <div class="col-sm-12">\
      <h2><%= headline %></h2>\
      <label>Search: <input type="search" id="contribSearch"></input></label>\
    </div>\
    <div class="contributions clearfix">\
    <% _.each(contributions, function(contribution) { %>\
      <div class="col-sm-6 contribution">\
        <a href="<%= contribution.linkPath() %>">\
          <span class="col-sm-8"><%= contribution.attributes.contributor.name %></span>\
          <span class="col-sm-4"><%= OpenDisclosure.friendlyMoney(contribution.attributes.amount) %></span>\
        </a>\
      </div>\
    <% }); %>\
    </div>'),

  events: {
    'keyup #contribSearch' : 'filterContributors',
  },

  initialize: function(options) {
    this.headline = options.headline;

    this.render();
  },

  render: function() {
    this.$el.html(this.template({
      headline : this.headline,
      contributions : this.collection
    }));
  },

  filterContributors: function() {
    // Adding this bit for the search feature on the contributors page
    // Adding as a separate bit to make it easier to remove if something
    // breaks due to its inclusion.
    var filterval = this.$('#contribSearch').val().trim().toLowerCase();
    $('.contribution').each(function(el) {
      var check_name = $(this).text().trim().toLowerCase();
      if ( check_name.indexOf(filterval) >= 0 ) {
        // $(this).css('background-color','cyan');
        $(this).show();
      } else {
        // $(this).css('background-color','magenta');
        $(this).hide();
      }
    });
  }

});
