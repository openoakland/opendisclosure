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
    var xRange = []
    var yRange = []
    var chart = this;
    chart.data = this.collection;
    chart.candidates = _.pluck(OpenDisclosure.BootstrappedData.candidates, "short_name");

    chart.color = d3.scale.ordinal()
      .domain(chart.candidates)
      .range(d3.range(12).map(function(i) {
        return "q" + (i + 1) + "-12";
      }));


      //SETTING SCALE
    for (var key in chart.data){
      if ( chart.data[key].length > 1 ){
        for ( i = 0; i < chart.data[key].length; i ++ ){
          var datum = chart.data[key][i]
          if (xRange.indexOf(datum.date) == -1) {
            xRange.push(datum.date)
          }
          if (yRange.indexOf(datum.amount) == -1) {
            yRange.push(datum.amount)
          }
        }
      }
    }
    xRange.sort(this.dateSortAsc)
      //SETTING SCALE


    var margin = {top: 0, right: 0, bottom: 30, left: 70},
      svgWidth = chart.dimensions.width;
      svgHeight = chart.dimensions.height;
      chartWidth = svgWidth - margin.left - margin.right;
      chartHeight = svgHeight - margin.top - margin.bottom;

    console.log({
      margin: margin,
      svgHeight: svgHeight,
      svgWidth: svgWidth,
      chartWidth: chartWidth,
      chartHeight: chartHeight
    })

    var x = d3.time.scale()
      .range([0, chartWidth]);

    var y = d3.scale.linear()
      .range([chartHeight, 0]);

    var format = d3.time.format.multi([ // "%b" );
    //   function(d){
    //   console.log(d);
    //   return "%b";
    // });
        ["%b '%y", function(d) { return (d.getMonth() == 0 && d.getYear() != 113) } ],
        ["%b '%y", function(d) { return (d.getMonth() == 4 && d.getYear() == 113) } ],
        ["%b", function() { return true; } ]
      ]);

     xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .ticks(d3.time.months, 1)
      .tickFormat(format);

     yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

    var line = d3.svg.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.close); });

    chart.svg = d3.select(el).append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight)
      .attr("viewBox", "0 0 " + svgWidth + " " + svgHeight)
      .attr("preserveAspectRatio", "xMidYMid")
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(d3.extent(xRange));
    y.domain(d3.extent(yRange));


    for (var key in chart.data){
      var data = chart.data[key]
      if ( data.length > 1 ){
        // shit breaks when there's only data point
        data.forEach(function(d) {
          d.close = d.amount
        })

        chart.svg.append("path")
          .datum(data)
          .attr("class", "line")
          .attr("id", key)
          .attr("d", line)
          .attr("class", chart.color(key)); //chart.candidateColors[key])
          // .text(key);
      }
    };

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
  },

  drawLegend: function() {
    var chart = this;

    var legend = {
      width: chart.dimensions.width / 4.8,
      offset: chart.dimensions.height / chart.candidates.length,
      right_bar: {
        width: chart.dimensions.width / 80
      },
      margin: chart.dimensions.width / 100,
      font_size: chart.dimensions.width / 50
    }

    chart.legend = chart.svg.selectAll('.legend')
      .data(chart.candidates)
      .enter().append('g')
      .attr("class", "legend")
      .attr("transform", function(d, i) {
        return "translate(0, " + i * legend.offset + ")";
      });

    d3.select('g.legend')
      .attr("class", "legend overview")

    // Show which candidate is selected
    chart.legend.append("rect")
      .attr('x', legend.width - legend.right_bar.width)
      .attr("width", legend.right_bar.width)
      .attr("height", legend.offset)
      .attr("class", 'status');

    // Dividers between candidates
    chart.legend.append("rect")
      .attr('x', legend.width - legend.right_bar.width)
      .attr("class", "divider")
      .attr("width", legend.right_bar.width)
      .attr("height", 2);

    chart.legend.append("text")
      .attr("x", legend.width - legend.margin - legend.right_bar.width)
      .attr("y", legend.offset / 2)
      .attr("font-size", legend.font_size)
      .attr("dy", ".35em")
      .text(function(d) {
        return d;
      })

    d3.select('.legend.overview text')
      .attr("font-size", legend.font_size + 4)

    // Hightlighted candidate name (fitted to text length)
    chart.legend.insert("rect", ":first-child")
      .attr("width", function() {
        var text = $(this).parent().find('text').get()[0]
        var width = text.getBBox().width;
        return width + legend.margin * 3;
      })
      .attr("x", function() {
        var right_edge = legend.width - legend.right_bar.width
        return right_edge - this.width.animVal.value;
      })
      .attr("height", legend.offset + 2) // Align to bottom spacer
    .attr("class", "name");

    d3.select('.legend.overview .name')
      .attr("height", legend.offset)
  }
})
