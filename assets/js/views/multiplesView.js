OpenDisclosure.MultiplesView = Backbone.View.extend({

  el: '.multiples',

  template: _.template(' \
    <div class="col-sm-6 contribution"><a href="#contributor/<%= contributor.id %>">\
    <span class="col-sm-8"><%= contributor.name %></span>\
    <span class="col-sm-4"><%= number %> candidates </span>\
    </a></div>'),

  initialize: function(options) {
    this.options = options;
    this.render();
  },

  render: function() {
    $('.multiples').empty();
    $('<section>\
	<div class="col-sm-12">\
	  <h2>Contributors Who Gave to More Than One Mayoral Candidate</h2>\
	</div>\
      <div class="multples clearfix"></div>\
     </div>\
    </section>').appendTo('.contributions');

    var that = this;
    _.each(this.collection, function( c ){
      $('.multples').append(that.template(c.attributes));
    });
    // Leave a little space at the bottom.
    $('.multples').append('<div class="col-sm-12"><h2></h2></div>');

  }

});
