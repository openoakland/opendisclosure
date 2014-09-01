OpenDisclosure.CategoryView = Backbone.View.extend({
  initialize: function(options) {
    this.options = options;
    this.render();
  },

  render: function() {
    this.$el.empty();
    this.$el.append('<h2>Total Contributions by Category');
    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Category');
    data.addColumn('number', 'Amount');
    data.addRow(['Not Itemized', this.options.summary.total_unitemized_contributions]);
    _.each(this.collection, function( c ){
      data.addRow([c.attributes.contype, c.attributes.amount]);
    });

    pieChart = new Backbone.GoogleChart({
      chartType: 'PieChart',
      options: {
       // 'title':'Total Contributions by Category',
       // 'titleTextStyle':{'fontSize':30, 'fontName':'Crete Round', 'color':'#555555'},
       'backgroundColor':'#E9E9E9',
       'chartArea':{'width':600},
                   'width':900,
                   'height':250},
      dataTable: data,
    });

    this.$el.append(pieChart.render().el);
    this.$el.append("<h5 class='footnote'>For more details on the data in this pie chart see the <a href='/faq#categoryChart'>FAQ</a></h5>");
  },

});
