OpenDisclosure.ContributorsView = Backbone.View.extend({
  template: _.template(' \
    <div class="col-sm-6"><a href="/party/<%= contributor.id %>/contributions">\
    <span class="col-sm-8"><%= contributor.name %></span>\
    <span class="col-sm-4">$<%= amount %> </span>\
    </a></div>'),

  events: {
    "keyup #contributor"  : "filterContributors",
  },

  initialize: function() {
    this.render();
  },

  render: function() {
    $('.contributions').empty();
    $('<section>\
      <style>\
				h2 {text-align:center;}\
      </style>\
			<br/>\
			<div class="col-sm-12">\
				<h2>Contributions</h2>\
			</div>\
      <div class="contributions clearfix"></div>\
     </div>\
    </section>').appendTo('.top_contributions');
    var that = this;
    _.each(this.collection, function( c ){
      $('.contributions').append(that.template(c.attributes));
    });
  },

  filterContributors: function() {
  // Adding this bit for the search feature on the contributors page
  // Adding as a separate bit to make it easier to remove if something
  // breaks due to its inclusion.

    var filterval = $('#contributor').val().trim().toLowerCase();
    $('li.contrib').each(function() {
      var check_name = $(this).first('a').text().trim().toLowerCase();
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
