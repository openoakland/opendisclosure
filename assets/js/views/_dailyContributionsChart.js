OpenDisclosure.DailyContributionsChartView = OpenDisclosure.ChartView.extend({
  dateSortAsc: function (date1, date2) {
    // This is a comparison function that will result in dates being sorted in
    // ASCENDING order. As you can see, JavaScript's native comparison operators
    // can be used to compare dates. This was news to me.
    date1 = new Date (date1)
    date2 = new Date (date2)
    if (date1 > date2) return 1;
    if (date1 < date2) return -1;
    return 0;
  },

  draw: function(el){
    var chart = this;
    chart.data = this.collection;
    chart.candidates = _.pluck(OpenDisclosure.BootstrappedData.candidates, "short_name");

    var margin = {top: 0, right: 0, bottom: 30, left: 70},
      svgWidth = chart.dimensions.width;
      svgHeight = chart.dimensions.height;
      chartWidth = svgWidth - margin.left - margin.right;
      chartHeight = svgHeight - margin.top - margin.bottom;

    chart.svg = d3.select(el).append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight)
      .attr("viewBox", "0 0 " + svgWidth + " " + svgHeight)
      .attr("preserveAspectRatio", "xMidYMid")
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Color scale - takes a candidate name and returns a CSS class name.
    chart.color = d3.scale.ordinal()
      .domain(chart.candidates)
      .range(d3.range(12).map(function(i) {
        return "q" + (i + 1) + "-12";
      }));

    var date_format = d3.time.format("%Y-%m-%d");
    var parse_date = date_format.parse;

    var x = d3.time.scale()
      .range([0, chartWidth]);

    var y = d3.scale.linear()
      .range([chartHeight, 0]);

    // For each candidate, add a starting point at $0
    // and an ending point for today.
    for (var candidate in chart.data) {
      var contributions = chart.data[candidate];
      contributions.unshift({
        amount: 0,
        date: contributions[0].date
      });
      contributions.push({
        amount: contributions[contributions.length - 1].amount,
        date: date_format(new Date())
      })
    }

    // Find the maximum contribution so we can set the range.
    var y_max = _.reduce(chart.data, function(maximum, candidate) {
      candidate_max = candidate[candidate.length - 1].amount;
      return Math.max(maximum, candidate_max);
    }, 0);

    x.domain([parse_date("2013-04-09"), parse_date("2014-08-31")]);
    y.domain([0, y_max]);

    // Format x axis labels
    var date_tick_format = d3.time.format.multi([ 
        ["%b '%y", function(d) { return (d.getMonth() == 0 && d.getYear() != 113) } ],
        ["%b '%y", function(d) { return (d.getMonth() == 4 && d.getYear() == 113) } ],
        ["%b", function() { return true; } ]
      ]);

     xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .ticks(d3.time.months, 1)
      .tickFormat(date_tick_format);

     yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

    var line = d3.svg.line()
      .x(function(d) { 
        return x(parse_date(d.date)); 
      })
      .y(function(d) { 
        return y(d.amount); 
      });

    // Plot each line.
    for (var candidate in chart.data){
      chart.svg.append("path")
        .datum(chart.data[candidate])
        .attr("class", "line")
        .attr("id", candidate)
        .attr("d", line)
        .attr("class", chart.color(candidate)); 
    }

    var font_size: chart.dimensions.width / 50;

    chart.svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (chartHeight) + ")")
      .call(xAxis);

    chart.svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Total Raised ($)");
  }
})
