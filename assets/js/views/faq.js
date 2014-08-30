OpenDisclosure.Views.Faq = Backbone.View.extend({
  template: _.template("\
    <div id='faq'>\
      <h1>Frequently Asked Questions</h1>\
      <section class='someSection'>\
        <a name='section1Name'></a>\
        <h2>Section Name</h2>\
        <div class='question'>\
          <a name='question1shortName'></a>\
          <h3>Here's a question</h3>\
          <p>Here's where the sanswer will go.</p>\
        </div>\
        <div class='question'>\
          <a name='question2shortName'></a>\
          <h3>Here's a question</h3>\
          <p>Here's where the sanswer will go.</p>\
        </div>\
      </section>\
      <section class='someSection'>\
        <h2>Section Name</h2>\
        <div class='question'>\
          <a name='question'></a>\
          <h3>Here's a question</h3>\
          <p>Here's where the sanswer will go.</p>\
        </div>\
        <div class='question'>\
          <h3>Here's a question</h3>\
          <p>Here's where the sanswer will go.</p>\
        </div>\
      </section>\
  </div>"),

  initialize: function(options) {
    this.render();
  },

  render: function() {
    this.$el.html(this.template());
  }

});
