OpenDisclosure.Search = Backbone.View.extend({
  initialize : function(options) {
    this.search = options.search || '';

    this.render();
  },

  render : function() {
    this.$el.append('<h3>Search for Contributors By Name</h3>\
                    <form id="search" action="/search">\
                      <input type="text" name="name" value="' + this.search + '"/>\
                      <input type="submit" value="Search Contributors"/>\
                    </form>');

    this.$('#search').on('submit', this.handleSearch.bind(this));
  },

  handleSearch : function(e) {
    e.preventDefault();

    window.appNavigate('/search/' + this.$('[name=name]').val(), { trigger: true });
  }
});
