OpenDisclosure.ContributorView = Backbone.View.extend({

  el: '.contributions',

  template: _.template(' \
    <div class="col-sm-6 contribution"><a href="/#candidate/<%= recipient.id %>">\
    <span class="col-sm-8"><%= recipient.name %></span>\
    <span class="col-sm-4"><%= OpenDisclosure.friendlyMoney(amount) %> </span>\
    </a></div>'),

  initialize: function(options) {
    this.options = options;
    this.render();
  },

  render: function() {
    $('.main').empty();
    $('<section>\
	<br/>\
	<div class="col-sm-12">\
	<h1>' + this.collection[0].attributes.contributor.name + '</h1>\
	</div>\
      <div class="contributions clearfix"></div>\
     </div>\
    </section>').appendTo('.main');

    var that = this;
    _.each(this.collection, function( c ){
      $('.contributions').append(that.template(c.attributes));
    });
  }
});
