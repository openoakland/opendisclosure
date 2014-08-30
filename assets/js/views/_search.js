OpenDisclosure.Search = Backbone.View.extend({
  initialize : function () {
    this.render();
  },
  render : function() {
    this.$el.append('<h3>Search for Contributors By Name</h3>\
		      <form id="search" action="search">\
			<input type="text" name="name" value=""/>\
			<input type="submit" value="Search Contributors"/>\
		      </form>');
  },
});
