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
        return { 'name' : candidate,
                 'total' : donation }
      });
      var max =  _.max(candidate_list, function(candidate) {
        return candidate.total;
      });
      amounts[zip]['max'] = max.name;
    });

    var candidates = _.keys(candidates);
    candidates.unshift('Overview');

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
        .attr("id", function(d) {
          zip = d.properties.ZIP;
        })
        .attr("d", chart.path)
        .attr('fill', '#d3d3d3')
        .attr('stroke', '#9c9c9c')
        

      zips.append("svg:title")
        .text(function(d) {
          return d.properties.ZIP + ": " + d.properties.PO_NAME;
        });

      zipUpdater = function(selection) {
        if ($(selection).select('text').text() == 'Overview') {
          zips.attr('class', function(d) {
            var leader = chart.data.amounts[d.properties.ZIP];
            return leader? chart.color(leader.max) : 'null';
          })
        } else {
          zips.attr('class', '');
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
        .attr('fill', 'none')
        .attr('stroke', '#303030')
        .append("svg:title");

      var bubbleUpdater = chart.drawBubbles();
      chart.drawScale();
      chart.drawLegend();
      chart.addListeners(bubbleUpdater, zipUpdater);
    });
  },

  drawBubbles: function() {
    var chart = this;

    var candidate = chart.data.candidates[0];
    var circles = chart.svg.append("g")
      .attr('id', 'circles');

    chart.bubbleScale = chart.dimensions.width * .00015;

    var radius = function(d) {
      if (chart.data.amounts[d.properties.ZIP]) {
        return Math.sqrt(chart.data.amounts[d.properties.ZIP][candidate] || 0) * chart.bubbleScale;
      }
      return 0;
    }

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
      .attr('r', radius)
      .attr('class', chart.color(candidate));

    // Update the chart when a user clicks on a candidate's name
    var updateBubbles = function(selection) {
      candidate = $(selection).select('text').text();
      dorling.attr('class', chart.color(candidate))
        .transition()
        .attr('r', radius);
    }

    return updateBubbles;

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
      .attr("x", legend.width / 2 - 5)
      .attr("y", offset / 2)
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .text(function(d) {
        return d;
      });
  },

  drawScale: function() {
    // Show the scale of bubbles on the chart
    var chart = this;

    var radius = function(area) {
      return Math.sqrt(area) * chart.bubbleScale;
    }

    var scale = chart.svg.append("g")
      .attr('id', 'scale')
      .attr("transform", "translate(" +
        chart.dimensions.width * .725 + ", " +
        chart.dimensions.height * .05 + ")");

    var scale_data = [1000, 10000, 50000];
    var offset = 20;
    var scale_items = scale.selectAll("g")
      .data(scale_data)
      .enter().append('g')
      .attr("transform", function(d) {
        var centerpoint = offset + radius(d);
        offset += radius(d) * 2 + 20;
        return "translate(" + centerpoint + ", 0)"
      });

    scale_items.append("circle")
      .attr('cy', chart.dimensions.height * .15 / 2)
      .attr('r', radius)
      .attr('fill', '#d3d3d3');

    scale_items.append("text")
      .attr("y", 70)
      .style("text-anchor", "middle")
      .text(function(d) {
        return "$" + d;
      })

    scale.insert("rect", ":first-child")
      .attr("width", offset)
      .attr("height", chart.dimensions.height * .2)
      .attr("fill", "#f0f0f0");

    scale.append("text")
      .attr("x", offset / 2)
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .text("Total donations from each ZIP code");

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
    opts.updateBubbles(opts.selection);
    opts.updateZips(opts.selection);

    // Update legend
    if ($(opts.selection).select('text').text() == 'Overview'){
      chart.legend.classed('selected', true);
    } else {
      chart.legend.classed('selected', false);
      opts.selection.classed('selected', true);
    }
    
    $('rect.status').not('g.legend.selected rect.status').fadeOut();
    $('g.legend.selected rect.status').fadeIn();

  }
  
});
