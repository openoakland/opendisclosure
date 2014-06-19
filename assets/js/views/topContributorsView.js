OpenDisclosure.TopContributorsView = Backbone.View.extend({
  template: _.template(' \
    <div class="col-sm-6">\
    <span class="col-sm-8"><%= contrib %></span>\
    <span class="col-sm-4">$<%= amount %> </span>\
    </div>'),

  initialize: function() {
    this.render();
  },

  render: function() {
    $('.top_contributions').empty();
    $('<section>\
      <div class="col-sm-12">\
        <h2>Top Contributors</h2>\
        <h4> by Employer/Business</h4>\
      </div>\
      <div class="top_contributions clearfix"></div>\
     </div>\
    </section>').appendTo('.main');
    var that = this;
    _.each(this.collection, function( c ){
      $('.top_contributions').append(that.template(c.attributes));
    });
  },

});
