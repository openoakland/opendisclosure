OpenDisclosure.ZipcodeChartView = OpenDisclosure.ChartView.extend({

  draw: function() {
    var chart = this;

    chart.data = this.processData(this.collection);

    chart.color = d3.scale.ordinal()
      .domain(chart.data.candidates)
      .range(d3.range(12).map(function(i) {
        return "q" + i + "-12";
      }));

    chart.path = d3.geo.path()
      .projection(d3.geo.albersUsa()
        .scale(90000)
        .translate([31600, 3230]));

    chart.svg = d3.select(this.el).append("svg")
      .attr("id", "map")
      .attr("width", chart.dimensions.width)
      .attr("height", chart.dimensions.height)
      .attr("viewBox", "0 0 " + chart.dimensions.width + " " + chart.dimensions.height)
      .attr("preserveAspectRatio", "xMidYMid");

    chart.drawZipcodes();
    chart.drawCities();
    chart.drawLegend();
  },

  processData: function(data) {
    var amounts = {};
    var candidates = {};

    for (var i = 0; i < data.length; i++) {
      var el = data.models[i].attributes,
        candidate = el.recipient.name,
        amount = (!isNaN(parseInt(el.amount))) ? parseInt(el.amount) : 0,
        zip = el.contributor.zip;

      // Add contributions by zip code
      if (!amounts[zip]) {
        amounts[zip] = {};
      }
      if (!amounts[zip][candidate]) {
        amounts[zip][candidate] = 0;
      }
      amounts[zip][candidate] += amount;

      // Create a list of all candidates
      if (!candidates[candidate]) {
        candidates[candidate] = true;
      }
    }
    var candidates = _.keys(candidates);

    return {
      candidates: candidates,
      amounts: amounts
    }
  },

  drawZipcodes: function() {
    var chart = this;

    var zipcodes = chart.svg.append("g")
      .attr("id", "bay-zipcodes");

    var candidate = chart.data.candidates[0];

    d3.json("/data/sfgov_bayarea_zipcodes_topo.json", function(json) {
      data = topojson.feature(json, json.objects.layer1).features;

      // Add map regions
      var zips = zipcodes.selectAll("path")
        .data(data)
        .enter().append("svg:path")
        .attr("id", function(d) {
          zip = d.properties.ZIP;
        })
        .attr("d", chart.path)
        .attr('fill', '#d3d3d3')
        .attr('stroke', '#9c9c9c')
        .append("svg:title")
        .text(function(d) {
          return d.properties.ZIP + ": " + d.properties.PO_NAME;
        });

      var circles = chart.svg.append("g")
        .attr('id', 'circles');

      radius = function(d) {
        if (chart.data.amounts[d.properties.ZIP]) {
          return Math.sqrt(chart.data.amounts[d.properties.ZIP][candidate] || 0) / 8;
        }
        return 0;
      }

      // Add a circle at the center of each zip
      var dorling = circles.selectAll("circle")
        .data(function() {
          return data
        })
        .enter()
        .append("circle")
        .each(function(d) {
          d.properties.c = chart.path.centroid(d);
        })
        .attr('cx', function(d) {
          return d.properties.c[0];
        })
        .attr('cy', function(d) {
          return d.properties.c[1];
        })
        .attr('r', radius)
        .attr('class', chart.color(candidate));

      // Update the chart when a user clicks on a candidate's name
      update = function() {
        candidate = $(this).select('text').text();
        dorling.attr('class', chart.color(candidate))
          .transition()
          .attr('r', radius);
      }

      chart.legend.on("click", update)
        .on("mouseover", function() {
          d3.select(this)
            .classed('hover', true);
        })
        .on("mouseout", function() {
          d3.select(this)
            .classed('hover', false);
        });
    });
  },

  drawCities: function() {
    var chart = this;
    // Add outline for cities
    d3.json("/data/sfgov_bayarea_cities_topo.json", function(json) {
      data = topojson.feature(json, json.objects.layer1).features;

      var cities = chart.svg.append('g')
        .attr('id', 'bay-cities');

      var cities = cities.selectAll("path")
        .data(data)
        .enter().append("svg:path")
        .attr("d", chart.path)
        .attr('fill', 'none')
        .attr('stroke', '#303030')
        .append("svg:title");
    });
  },

  drawLegend: function() {
    var chart = this;
    // Add a legend at the bottom!
    var svg_legend = d3.select(chart.el).append("svg")
      .attr("id", "legend")
      .attr("width", chart.dimensions.width)
      .attr("height", chart.dimensions.height)
      .attr("viewBox", "0 0 " + chart.dimensions.width + " " + chart.dimensions.height)
      .attr("preserveAspectRatio", "xMidYMid");

    var offset = chart.dimensions.width / chart.data.candidates.length;

    chart.legend = svg_legend.selectAll('.legend')
      .data(chart.data.candidates)
      .enter().append('g')
      .attr("class", "legend")
      .attr("transform", function(d, i) {
        return "translate(" + i * offset + ",0)";
      });

    chart.legend.append("rect")
      .attr('x', 0)
      .attr('y', 0)
      .attr("width", offset)
      .attr("height", 10)
      .attr("class", function(d) {
        return 'status ' + chart.color(d);
      });

    chart.legend.append("rect")
      .attr("x", 0)
      .attr("y", 10)
      .attr("width", offset)
      .attr("height", 18)
      .attr("class", function(d) {
        return chart.color(d);
      });

    chart.legend.append("text")
      .attr("x", offset / 2)
      .attr("y", 34)
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .text(function(d) {
        return d;
      });
  },

  drawScale: function() {
    // Show the scale of bubbles on the chart
    // var scale = svg.append("g")
    //  .attr('id', 'scale');

    // var scale_data = [50000, 10000, 1000];
    // var scale_height = Math.sqrt(scale_data[0])/8;
    // scale.selectAll("circle")
    //  .data(scale_data)
    //  .enter()
    //  .append("circle")
    //  .attr('cx', 50)
    //  .attr('cy', function(d) {
    //    return 50 + scale_height - Math.sqrt(d)/8
    //  })
    //  .attr('r', function(d) {
    //    return Math.sqrt(d)/8;
    //  })
    //  .attr('stroke', '#000000')
    //  .attr('fill', 'none');
  }

<<<<<<< HEAD
});
=======

});
>>>>>>> Chart loads via backbone chart wrapper
