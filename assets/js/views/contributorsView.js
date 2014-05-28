OpenDisclosure.ContributorsView = Backbone.View.extend({

  el: '.contributions',

  template: _.template(' \
    <div class="col-sm-6 contribution"><a href="/party/<%= contributor.id %>/contributions">\
    <span class="col-sm-8"><%= contributor.name %></span>\
    <span class="col-sm-4">$<%= amount %> </span>\
    </a></div>'),

  // events: {
  //   "keyup #contribSearch"  : "filterContributors",
  // },

  initialize: function() {
    this.render();
  },

  render: function() {
    $('.contributions').empty();
    var that = this;
    _.each(this.collection, function( c ){
      that.$el.append(that.template(c.attributes));
    });

    that = this;
    $('body').keyup(function(){
      that.filterContributors();
    });
  },

  filterContributors: function() {
  // Adding this bit for the search feature on the contributors page
  // Adding as a separate bit to make it easier to remove if something
  // breaks due to its inclusion.
    var filterval = $('#contribSearch').val().trim().toLowerCase();
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
