OpenDisclosure.CategoryView = Backbone.View.extend({
  initialize: function() {
    this.render();
  },

  render: function() {
    $('.categories').empty();

      // Create the data table.
      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Category');
      data.addColumn('number', 'Amount');
      _.each(this.collection, function( c ){
	data.addRow([c.attributes.contype, c.attributes.amount]);
      });

      pieChart = new Backbone.GoogleChart({
	chartType: 'PieChart',
        options: {'title':'Total Contributions by Category',
		       'titleTextStyle':{'fontSize':30, 'fontName':'Courier New', 'color':'#555555'},
		       'backgroundColor':'#E9E9E9',
		       'chartArea':{'width':600},
                       'width':900,
                       'height':250},

	dataTable: data,
      });

    $('.candidate').append('<section>\
			<div class="categories clearfix">');
    $('.candidate').append(pieChart.render().el);
    $('.candidate').append('</div></section>');
  },

});
