OpenDisclosure.Views.PaymentCategory = Backbone.View.extend({
  initialize: function(options) {
    this.options = options;
    _.bindAll(this, 'displayDetails');
    // We don't want to show this section until someone clicks
    $(this.options.list).hide();
    this.render();
  },

  render: function() {
    var attributes = this.options.attributes;
    this.$el.empty();
    this.$el.append('<h2>Total Payments by Category</h2>');
    // Create the data table.
    var data = new google.visualization.DataTable();
    this.data = data;
    data.addColumn('string', 'Category');
    data.addColumn('number', 'Amount');
    data.addColumn('string', 'Code');
    _.each(this.collection, function( c ){
      data.addRow([c.attributes.text, c.attributes.amount, c.attributes.code]);
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

    // Clicking on the chart loads the details
    pieChart.on('select', this.displayDetails);
    this.$el.append($('<div style="width: 300px; margin: auto">').html(pieChart.el));
    this.$el.append("<h5>Click on chart or labels to drill down to actual payments</h5>");
  },

  displayDetails : function(chartObject) {
    data = this.data;
    selection = chartObject.getSelection()[0];
    if (!selection) return;
    collection = _.filter(this.options.payments.models, function(c) {
      return c.attributes.code == data.getValue(selection.row, 2)
    });
    $(this.options.list).show();
    new OpenDisclosure.PaymentsView({
      el: this.options.list,
      headline: 'All Payments for ' + data.getValue(selection.row, 0),
      collection: collection
    });
  }

});
