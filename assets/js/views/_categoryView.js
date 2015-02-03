OpenDisclosure.CategoryView = Backbone.View.extend({
  initialize: function(options) {
    this.options = options;
    this.render();
  },

  render: function() {
    var attributes = this.options.attributes;
    this.$el.empty();
    this.$el.append('<h2>Total Contributions by Category</h2>');
    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Category');
    data.addColumn('number', 'Amount');
    data.addRow(['Not Itemized', attributes.summary.total_unitemized_contributions]);
    _.each(this.collection, function( c ){
      data.addRow([c.attributes.contype, c.attributes.amount]);
    });

    pieChart = new Backbone.GoogleChart({
      chartType: 'PieChart',
      options: {
       // 'title':'Total Contributions by Category',
       // 'titleTextStyle':{'fontSize':30, 'fontName':'Crete Round', 'color':'#555555'},
       'backgroundColor': '#E9E9E9',
       'chartArea': {
         'width': 300
       },
       'width': 300,
       'height': 250,
       'sliceVisibilityThreshold': 0
      },
      dataTable: data,
    });

    pieChart.render();
    this.$el.append($('<div style="width: 300px; margin: auto">').html(pieChart.el));
    this.$el.append("<h5 class='footnote'>For more details on the data in this pie chart see the <a href='/faq#categoryChart'>FAQ</a></h5>");
  },

});
