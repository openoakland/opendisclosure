(function() {

  var App = function() {};

  App.prototype.init = function(chartEl, data) {
    // Processing data from CSV
    var amounts = {};
    for (var i = 0; i < data.length; i++) {
      var el = data[i],
        amount = (!isNaN(parseInt(el.Tran_Amt1))) ? parseInt(el.Tran_Amt1) : 0;
        candidate = el.Filer_NamL,
        donor = el.Tran_NamF + ' ' + el.Tran_NamL
        city = el.Tran_City,
        state = el.Tran_State;

      // Add candidates
      if (!amounts[candidate]) {
        amounts[candidate] = {
          'dollars': {
            'total': 0,
            'oakland': 0,
            'california': 0
          },
          'donors': {
            'total': {},
            'oakland': {},
            'california': {}
          }
        }
      }

      // Increment donations and donors
      amounts[candidate]['dollars']['total'] += amount;
      amounts[candidate]['donors']['total'][donor] = true
      if (state == 'CA') {
        amounts[candidate]['dollars']['california'] += amount;
        amounts[candidate]['donors']['california'][donor] = true
        if (city == 'Oakland') {
          amounts[candidate]['dollars']['oakland'] += amount;
          amounts[candidate]['donors']['oakland'][donor] = true
        }
      }
    }

    // Convert data to an array of objects
    data = _.collect(amounts, function(v, k) {

      // Summing donor totals
      total_donors = _.collect(v['donors']['total'], function(donor, status) {
        return status;
      }).length
      oakland_donors = _.collect(v['donors']['oakland'], function(donor, status) {
        return status;
      }).length
      california_donors = _.collect(v['donors']['california'], function(donor, status) {
        return status;
      }).length


      return {
        name: k,
        dollars: {
          total: v['dollars']['total'],
          oakland: v['dollars']['oakland'],
          california: v['dollars']['california']
        },
        donors: {
          total: total_donors,
          oakland: oakland_donors,
          california: california_donors
        }
      }
    });
    data = _.filter(data, function(el) {
      return !isNaN(el.dollars.total) || !isNaN(el.dollars.oakland) || !isNaN(el.dollars.california);
    });
    data = _.sortBy(data, function(el) {
      return -el.dollars.total;
    });
    // End of data processing

    // Add radio buttons
    var formHTML = "<div id='chart-options'>\
        <form id='scale_type'>\
          <label><input type='radio' name='dataset' value='total' checked> Total</label>\
          <label><input type='radio' name='dataset' value='percent'> Percent</label>\
        </form>\
        <form id='count_type'>\
          <label><input type='radio' name='dataset' value='dollars' checked> Dollars</label>\
          <label><input type='radio' name='dataset' value='donors'> Donors</label>\
        </form>\
      </div>";
    $(chartEl).append(formHTML);
    var scale_type = 'total'; // total or percent.
    var count_type = 'dollars'; // dollars or donors.

    var labels = ['Others', 'California', 'Oakland'];

    var margin = {
      top: 30,
      right: window.innerWidth * (1/12),
      bottom: 60,
      left: 0
    },
      width = 960 - margin.left - margin.right,
      height = 800 - margin.top - margin.bottom;

    // Define variables for D3 axis.
    var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1); //.1

    var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

    x.domain(data.map(function(d) {
      return d.name;
    }));

    var y = d3.scale.linear()
      .range([height, 0]);

    setYFormat = function() {
      var format_string;
      if (scale_type == 'percent') {
        y.domain([0, 1]);
        format_string = "%.0";

      } else {
        y.domain([0, d3.max(data, function(d) {
          return d[count_type].total;
        })]);
        if (count_type == 'dollars') {
          format_string = "$.0";
        } else {
          format_string = "0";
        }
      }
      format = d3.format(format_string);

      yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(format);
    }
    setYFormat();

    yLabel = function() {
      var name = "";
      if (scale_type == 'percent') {
        name += 'Percent of ';
      }
      if (count_type == 'dollars') {
        name += 'Dollars Raised';
      } else {
        name += 'Donors';
      }
      return name;
    }

    var svg = d3.select(chartEl).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Create x and y axis.
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", function(d) {
        return "rotate(-65)"
      });

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text(yLabel());

    // Create a container for each bar.
    var valgroup = svg.selectAll('g.valgroup')
      .data(data)
      .enter().append('g')
      .attr('class', 'bar')
      .attr("transform", function(d) {
        var offset = x(d.name) + 14
        return "translate(" + x(d.name) + ",0)";
      });

    // Fill the bars with stacked rectangles.
    rectangleData = function(d) {
      d = d[count_type];
      if (d.total == 0) { // Avoid divide by 0 errors
        return [[0,0],[0,0],[0,0]];
      }
      if (scale_type == 'total') {
        result = [
          [d.total, d.total - d.california],
          [d.california, d.california - d.oakland],
          [d.oakland, d.oakland]
        ];
      } else {
        result = [
          [1, (d.total - d.california) / d.total],
          [d.california / d.total, (d.california - d.oakland) / d.total],
          [d.oakland / d.total, d.oakland / d.total]
        ];
      }
      return result;
    }

    var rectangles = valgroup.selectAll('rect')
      .data(rectangleData)
      .enter().append('rect')
      .attr('width', x.rangeBand())
      .attr('y', function(d) {
        return y(d[0]);
      })
      .attr('height', function(d) {
        return height - y(d[1]);
      })
      .attr('class', function(d, i) {
        return labels[i];
      });

    d3.selectAll("input")
      .on("change", update);

    // Update the chart when a radio button is clicked.
    function update() {
      scale_type = $("#scale_type input[type='radio']:checked").val();
      count_type = $("#count_type input[type='radio']:checked").val();

      // Update the scale and label on y axis.
      setYFormat();
      d3.select(chartEl).selectAll('.y.axis').call(yAxis)
        .selectAll('.label').text(yLabel());

      // Update the stacked bars.
      rectangles = rectangles.data(rectangleData);
      rectangles
        .transition()
        .attr('width', x.rangeBand())
        .attr('y', function(d) {
          return y(d[0]);
        })
        .attr('height', function(d) {
          return height - y(d[1]);
        })
        .duration(1000);
    }

    // Add legend.
    var legend = svg.selectAll(".legend")
      .data(labels)
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) {
        return "translate(0," + i * 20 + ")";
      });

    legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .attr("class", function(d) {
        return d;
      });

    legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) {
        return d;
      });
  }

  donorLocation = function(chartEl, data) {
    var app = new App();
    app.init(chartEl, data);
  };

})();
