OpenDisclosure.ZipcodeChartView = OpenDisclosure.ChartView.extend({

  draw: function() {
    var chart = this;

    chart.data = this.processData(this.collection);

    chart.color = d3.scale.ordinal()
      .domain(chart.data.candidates)
      .range(d3.range(12).map(function(i) {
        return "q" + i + "-12";
      }));

    // Calculate scale and translation of map projection based on chart size
    var b = [
        [-0.3522484, -0.0361021875],
        [-0.3426890625, -0.0304853125]
      ],
      s = .95 / Math.max((b[1][0] - b[0][0]) / chart.dimensions.width, (b[1][1] - b[0][1]) / chart.dimensions.height),
      t = [(chart.dimensions.width - s * (b[1][0] + b[0][0])) / 2, (chart.dimensions.height - s * (b[1][1] + b[0][1])) / 2];

    chart.path = d3.geo.path()
      .projection(d3.geo.albersUsa()
        .scale(s)
        .translate(t));

    chart.svg = d3.select(this.el).append("svg")
      .attr("id", "map")
      .attr("width", chart.dimensions.width)
      .attr("height", chart.dimensions.height)
      .attr("viewBox", "0 0 " + chart.dimensions.width + " " + chart.dimensions.height)
      .attr("preserveAspectRatio", "xMidYMid");

    chart.svg.append("rect")
      .attr("id", "background")
      .attr("width", chart.dimensions.width)
      .attr("height", chart.dimensions.height);

    chart.drawMap();
  },

  processData: function(data) {
    var candidateNames = {
      'Parker for Oakland Mayor 2014': 'Brian Parker',
      'Re-Elect Mayor Quan 2014': 'Jean Quan',
      'Libby Schaaf for Oakland Mayor 2014': 'Libby Schaaf',
      'Joe Tuman for Mayor 2014': 'Joe Tuman'
    };

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
      if (!amounts[zip][candidateNames[candidate]]) {
        amounts[zip][candidateNames[candidate]] = 0;
      }
      amounts[zip][candidateNames[candidate]] += amount;

      // Create a list of all candidates
      if (!candidates[candidateNames[candidate]]) {
        candidates[candidateNames[candidate]] = true;
      }
    }

    _.map(amounts, function(val, zip) {
      var candidate_list = _.map(val, function(donation, candidate) {
        return {
          'name': candidate,
          'total': donation
        }
      });
      var max = _.max(candidate_list, function(candidate) {
        return candidate.total;
      });
      amounts[zip]['max'] = max.name;
    });

    var candidates = _.keys(candidates);
    candidates.unshift('Overview');
    candidates.push('Lauren Conrad');
    candidates.push('Drake');
    candidates.push('Ace Ventura');

    return {
      candidates: candidates,
      amounts: amounts
    }
  },

  drawMap: function() {
    var chart = this;

    var zipcodes = chart.svg.append("g")
      .attr("id", "bay-zipcodes");

    d3.json("/data/sfgov_bayarea_zipcodes_topo.json", function(json) {
      chart.zips = topojson.feature(json, json.objects.layer1).features;

      // Add map regions
      var zips = zipcodes.selectAll("path")
        .data(chart.zips)
        .enter().append("svg:path")
        .attr("class", "zip")
        .attr("id", function(d) {
          zip = d.properties.ZIP;
        })
        .attr("d", chart.path)
        .attr('class', function(d) {
          var leader = chart.data.amounts[d.properties.ZIP];
          return leader ? chart.color(leader.max) : 'zip';
        });

      zips.append("svg:title")
        .text(function(d) {
          return d.properties.ZIP + ": " + d.properties.PO_NAME;
        });

      zipUpdater = function(selection) {
        if ($(selection).select('text').text() == 'Overview') {
          zips.attr('class', function(d) {
            var leader = chart.data.amounts[d.properties.ZIP];
            return leader ? chart.color(leader.max) : 'zip';
          })
        } else {
          zips.attr('class', 'zip');
        }
      }

      chart.drawCities(zipUpdater);
    });
  },

  drawCities: function(zipUpdater) {
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
        .attr('class', 'city')
        .append("svg:title");

      chart.drawBubbles();
      chart.drawScale();
      chart.drawLegend();
      chart.addListeners(chart.updateBubbles, zipUpdater);
    });
  },

  drawBubbles: function() {
    var chart = this;

    var candidate = chart.data.candidates[0];
    var circles = chart.svg.append("g")
      .attr('id', 'circles');

    // Add a circle at the center of each zip
    var dorling = circles.selectAll("circle")
      .data(function() {
        return chart.zips;
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
      //.attr('r', radius)
      .attr('class', chart.color(candidate));
  },

  // Update the chart when a user clicks on a candidate's name
  updateBubbles: function(selection) {
    var chart = this;
    var circles = d3.selectAll("svg circle")
    candidate = $(selection).select('text').text();
    circles.attr('class', chart.color(candidate))
      .transition()
      .attr('r', chart.radius.bind(chart));
  },

  radius: function(d) {
    var chart = this;
    var bubbleScale = chart.dimensions.width * .00018;
    var area = 0;
    if (d.properties) {
      if (chart.data.amounts[d.properties.ZIP]) {
        area = chart.data.amounts[d.properties.ZIP][candidate] || 0;
      }
    } else {
      area = d;
    }
    return Math.sqrt(area) * bubbleScale;
  },

  drawLegend: function() {
    var chart = this;

    var offset = chart.dimensions.height / chart.data.candidates.length;
    var legend = {
      width: chart.dimensions.width / 6
    }

    chart.legend = chart.svg.selectAll('.legend')
      .data(chart.data.candidates)
      .enter().append('g')
      .attr("class", "legend")
      .attr("transform", function(d, i) {
        return "translate(0, " + i * offset + ")";
      });

    // Hold candidate name
    chart.legend.append("rect")
      .attr("width", legend.width)
      .attr("height", offset)
      .attr("class", "name");

    chart.legend.append("rect")
      .attr()

    // Show which candidate is selected
    chart.legend.append("rect")
      .attr('x', legend.width - 10)
      .attr("width", 10)
      .attr("height", offset)
      .attr("class", function(d) {
        return 'status ' + chart.color(d);
      });

    // Dividers between candidates
    chart.legend.append("rect")
      .attr("width", legend.width)
      .attr("height", 3)
      .attr("fill", "white");

    chart.legend.append("text")
      .attr("x", legend.width - 22) //legend.width / 2 - 5)
    .attr("y", offset / 2)
      .attr("dy", ".35em")
      .text(function(d) {
        return d;
      });
  },

  drawScale: function() {
    // Show the scale of bubbles on the chart
    var chart = this;

    var scale = {
      dimensions: {
        width: chart.dimensions.width * .232,
        height: chart.dimensions.height * .2,
        left: chart.dimensions.width * .768,
        top: chart.dimensions.height * .8
      },
      data: [1000, 10000, 30000]
    };

    scale.el = chart.svg.append("g")
      .attr('id', 'scale')
      .attr("transform", "translate(" +
        scale.dimensions.left + ", " +
        scale.dimensions.top + ")");

    var offset = 20;
    var scale_items = scale.el.selectAll("g")
      .data(scale.data)
      .enter().append('g')
      .attr("transform", function(d) {
        var centerpoint = offset + chart.radius(d);
        offset += chart.radius(d) * 2 + 25;
        return "translate(" + centerpoint + ", 0)"
      });

    scale_items.append("circle")
      .attr('cy', scale.dimensions.height / 2)
      .attr('fill', '#d3d3d3');

    scale_items.append("text")
      .attr("y", 70)
      .style("text-anchor", "middle")
      .text(function(d) {
        return "$" + d / 1000 + "k";
      });

    scale.el.insert("rect", ":first-child")
      .attr("width", scale.dimensions.width)
      .attr("height", scale.dimensions.height)
      .attr("fill", "#f0f0f0");

    scale.el.append("text")
      .attr("x", 0)
      .attr("dy", ".35em")
      .text("Total donations from each zip code.")
      .call(this.wrap, scale.dimensions.width)

  },

  addListeners: function(updateBubbles, updateZips) {
    var chart = this;

    chart.legend
      .on("click", function() {
        var selection = d3.select(this)
        chart.update({
          selection: selection,
          updateBubbles: updateBubbles,
          updateZips: updateZips
        });
      })
      .on("mouseover", function() {
        d3.select(this)
          .classed('hover', true);
      })
      .on("mouseout", function() {
        d3.select(this)
          .classed('hover', false);
      });
  },

  update: function(opts) {
    var chart = this;
    // Update chart
    chart.updateBubbles(opts.selection)
    opts.updateZips(opts.selection);

    var legend = {
      width: chart.dimensions.width / 6
    }

    var label = $(opts.selection).select('text').text();

    // Update legend

    if (label == 'Overview') { // Overview
      chart.legend.classed('selected', true);
      $('g#scale').fadeOut()

    } else { // Candidates
      // Return previously selected bar to normal size
      chart.legend.select('.selected .status')
        .transition()
        .attr("x", legend.width - 10)
        .attr("width", 10)
        .each("end", function() {
          chart.legend.attr("class", "legend deselected");
          opts.selection.attr("class", "legend selected")
        });

      // Expand selected bar
      opts.selection.select('.status')
        .transition()
        .attr("x", 0)
        .attr("width", legend.width);

      $('g#scale').fadeIn();
    }
  },

  // From http://bl.ocks.org/mbostock/7555321
  wrap: function(text, width) {
    text.each(function() {
      var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
        }
      }
    });
  }
  
});
