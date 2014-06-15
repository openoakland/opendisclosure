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

    chart.drawMap(function(zipUpdater) {
      chart.drawCities(zipUpdater, function() {
        chart.drawBubbles();
        chart.drawScale();
        chart.drawLegend();
        chart.drawOverviewDescription();
        chart.clickListener();
        chart.click(d3.select('.overview'), 'Overview');
      });
    });
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
    candidates.push('Patrick McCullough');
    candidates.push('Courtney Ruby');
    candidates.push('Ace Ventura');
    candidates.push('Buzz Aldrin');

    return {
      candidates: candidates,
      amounts: amounts
    }
  },

  drawMap: function(done) {
    var chart = this;

    var zipcodes = chart.svg.append("g")
      .attr("id", "bay-zipcodes");

    d3.json("/data/sfgov_bayarea_zipcodes_topo.json", function(json) {
      chart.zips = topojson.feature(json, json.objects.layer1).features;

      // Add map regions
      zips = zipcodes.selectAll("path")
        .data(chart.zips)
        .enter().append("svg:path")
        .attr("class", "zip")
        .attr("id", function(d) {
          zip = d.properties.ZIP;
        })
        .attr("d", chart.path);

      zips.append("svg:title")
        .text(function(d) {
          return d.properties.ZIP + ": " + d.properties.PO_NAME;
        });

      done(chart.zipUpdater);
    });
  },

  updateZips: function(selection) {
    var chart = this;
    var zips = d3.selectAll('.zip');
    if ($(selection).select('text').text() == 'Overview') {
      zips.attr('class', function(d) {
        var leader = chart.data.amounts[d.properties.ZIP];
        return leader ? chart.color(leader.max) + ' zip' : 'zip';
      })
    } else {
      zips.attr('class', 'zip');
    }
  },

  drawCities: function(zipUpdater, done) {
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

      done();

    });
  },

  drawBubbles: function() {
    var chart = this;

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
      });
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

  clearBubbles: function() {
    d3.selectAll("g#circles circle").attr('r', 0);
  },

  radius: function(d) {
    var chart = this;
    var bubbleScale = chart.dimensions.width * .00014;
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

    var legend = {
      width: chart.dimensions.width / 4.8,
      offset: chart.dimensions.height / chart.data.candidates.length,
      right_bar: {
        width: chart.dimensions.width / 80
      },
      margin: chart.dimensions.width / 100,
      font_size: chart.dimensions.width / 50
    }

    chart.legend = chart.svg.selectAll('.legend')
      .data(chart.data.candidates)
      .enter().append('g')
      .attr("class", "legend")
      .attr("transform", function(d, i) {
        return "translate(0, " + i*legend.offset + ")";
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
      .text(function(d) { return d; })

    d3.select('.legend.overview text')
      .attr("font-size", legend.font_size + 4)

    // Hightlighted candidate name (fitted to text length)
    chart.legend.insert("rect", ":first-child")
      .attr("width", function() {
        var text = $(this).parent().find('text').get()[0]
        var width = text.getBBox().width;
        return width + legend.margin*3;
      })
      .attr("x", function() {
        var right_edge = legend.width - legend.right_bar.width
        return right_edge - this.width.animVal.value;
      })
      .attr("height", legend.offset + 2) // Align to bottom spacer
      .attr("class", "name");

    d3.select('.legend.overview .name')
      .attr("height", legend.offset)
  },

  drawScale: function() {
    // Show the scale of bubbles on the chart
    var chart = this;
    var scale = {
      dimensions: {
        width: chart.dimensions.width * .225,
        height: chart.dimensions.height * .21,
        left: chart.dimensions.width * .44,
        top: chart.dimensions.height * .79
      },
      data: [1000, 10000, 25000],
      font_size: chart.dimensions.width / 54,
      bubble_spacer: chart.dimensions.width * .046
    };

    scale.el = chart.svg.append("g")
      .attr('id', 'scale')
      .attr("transform", "translate(" +
        scale.dimensions.left + ", " +
        scale.dimensions.top + ")");

    var offset = scale.bubble_spacer * .6;
    var scale_items = scale.el.selectAll("g")
      .data(scale.data)
      .enter().append('g')
      .attr("transform", function(d) {
        var centerpoint = offset + chart.radius(d);
        offset += chart.radius(d) * 2 + scale.bubble_spacer;
        return "translate(" + centerpoint + ", 0)"
      });

    scale_items.append("circle")
      .attr('cy', function(d) {
        return scale.dimensions.height*.72 - chart.radius(d);
      });

    scale_items.append("text")
      .attr("y", scale.dimensions.height*.95)
      .attr("font-size", scale.font_size)
      .attr("class", "name")
      .text(function(d) {
        return "$" + d / 1000 + "k";
      });

    scale.el.append("text")
      .attr("dy", "1.4em")
      .attr("font-size", scale.font_size)
      .text("Total donations from each zip code.")
      .call(this.wrap, scale.dimensions.width)

  },

  drawOverviewDescription: function() {
    var chart = this;
    var scale = {
      dimensions: {
        width: chart.dimensions.width * .24,
        height: chart.dimensions.height * .21,
        left: chart.dimensions.width * .44,
        top: chart.dimensions.height * .79
      },
      data: [1000, 10000, 25000],
      font_size: chart.dimensions.width / 54,
      bubble_spacer: chart.dimensions.width * .046
    };

    scale.el = chart.svg.append("g")
      .attr('id', 'overview-description')
      .attr("transform", "translate(" +
        scale.dimensions.left + ", " +
        scale.dimensions.top + ")");

    scale.el.append("text")
      .attr("dy", "1.4em")
      .attr("font-size", scale.font_size)
      .text("Candidate who raised the most money in each ZIP code. ")
      .call(this.wrap, scale.dimensions.width)

    scale.el.append("text")
      .attr("dy", "1.4em")
      .attr("font-size", scale.font_size)
      .attr("class", "grey")
      .text("Click the candidates to see where they raised money.")
      .call(this.wrap, scale.dimensions.width)
      .attr("y", "3.2em")
  },

  clickListener: function() {
    var chart = this;

    chart.legend.on("click", function() {
      var clicked = d3.select(this);
      var label = $(this).select('text').text();
      chart.click(clicked, label)
    });
  },

  click: function(clicked, label) {
    var chart = this;
    chart.updateZips(clicked);

    // Update legend
    chart.legend.classed("selected", false);
    clicked.classed("selected", true);
    if (label == 'Overview') {
      chart.clickOverview(clicked, label);
    } else {
      chart.clickCandidate(clicked, label)
    }
  },

  clickOverview: function(clicked, label) {
    var chart = this;

    chart.clearBubbles();

    chart.legend.each(function() {
      var key_color = chart.color($(this).select('text').text());
      d3.select(this).select('.status')
        .attr("class", key_color + " status");
    });
    chart.setOverviewHover();
    $('g#overview-description').fadeIn();
    $('g#scale').fadeOut();
  },

  clickCandidate: function(clicked, label) {
    var chart = this;
    var color = chart.color(label);

    chart.updateBubbles(clicked);
    
    chart.legend.select('.status')
      .attr("class", "status");
    clicked.select('.status')
      .attr("class", color + " status");

    chart.legend.select('.name')
      .attr("class", "name");

    chart.setCandidateHover();
    $('g#scale').fadeIn();
    $('g#overview-description').fadeOut();
  },

  setOverviewHover: function() {
    $('.legend').unbind('mouseenter mouseleave');

    $('.legend').hover(function() {
      d3.select(this).select('.name')
        .attr("class", "name highlight");
    }, function() {
      d3.select(this).select('.name')
        .attr("class", "name");
    });
  },

  setCandidateHover: function() {
    var chart = this;
    $('.legend').unbind('mouseenter mouseleave');

    // Add new hover functionality
    $('.legend').not('.selected').hover(function() {
      var label = $(this).find('text').text();
      var color = chart.color(label);
      d3.select(this).select('.status')
        .attr("class", color + " status");
    }, function() {
      d3.select(this).select('.status')
        .attr("class", "status");
    });
  },

  // From http://bl.ocks.org/mbostock/7555321
  wrap: function(text, width) {
    text.each(function() {
      var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 0,//1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
        console.log({ y: y,
                      dy: dy });
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
