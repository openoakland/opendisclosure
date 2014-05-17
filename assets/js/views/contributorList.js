OpenDisclosure.contributorsList = Backbone.View.extend({
  tagname : 'li',

  events:{
    "keyup #contributor"  : "filterContributors",
  },

  initialize : function() {
    this.render();
  },

  render : function() {
    this.$el.html(this.template(this.collection));
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