// Shapefiles from https://data.sfgov.org/
// Converted to Geo-JSON using ogr2ogr
// Geo-JSON simplified 50% - mapshaper.org

(function() {
	var App = function() {};

	App.prototype.init = function(chartEl, data) {

		// Begin data processing
		var amounts = {};
		var candidates = {};

		for (var i = 0; i < data.length; i++) {
			var el = data[i],
				candidate = el.Filer_NamL,
				amount = (!isNaN(parseInt(el.Tran_Amt1))) ? parseInt(el.Tran_Amt1) : 0,
				zip = el.Tran_Zip4.substring(0, 5)
				city = el.Tran_City;

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
		// End of data processing

		var margin = {
			top: 30,
			right: 40,
			bottom: 300,
			left: 50
		},
			width = 960 - margin.left - margin.right,
			height = 800 - margin.top - margin.bottom;

		var color = d3.scale.ordinal()
			.domain(candidates)
			.range(d3.range(12).map(function(i) {
				return "q" + i + "-12";
			}));

		var path = d3.geo.path()
			.projection(d3.geo.albersUsa()
				.scale(90000)
				.translate([31600, 3230]));

		var svg = d3.select(chartEl).append("svg")
			.attr("id", "map")
			.attr("width", width + margin.right)
			.attr("height", height);

		var zipcodes = svg.append("g")
			.attr("id", "bay-zipcodes");

		var candidate = candidates[0];

		d3.json("/data/sfgov_bayarea_zipcodes_topo.json", function(json) {
			data = topojson.feature(json, json.objects.layer1).features;

			// Add map regions
			var zips = zipcodes.selectAll("path")
				.data(data)
				.enter().append("svg:path")
				.attr("id", function(d) {
					zip = d.properties.ZIP;
				})
				.attr("d", path)
				.attr('fill', '#d3d3d3')
				.attr('stroke', '#9c9c9c')
				.append("svg:title")
				.text(function(d) {
					return d.properties.ZIP + ": " + d.properties.PO_NAME;
				});

			var circles = svg.append("g")
				.attr('id', 'circles');

			radius = function(d) {
    		if (amounts[d.properties.ZIP]){
					return Math.sqrt( amounts[d.properties.ZIP][candidate] || 0)/8;
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
					d.properties.c = path.centroid(d);
				})
				.attr('cx', function(d) {
					return d.properties.c[0];
				})
				.attr('cy', function(d) {
					return d.properties.c[1];
				})
				.attr('r', radius)
				.attr('class', color(candidate));

			// Update the chart when a user clicks on a candidate's name
			update = function() {
				candidate = $(this).select('text').text();
				dorling.attr('class', color(candidate))
					.transition()
					.attr('r', radius);
			}

			legend.on("click", update)
				.on("mouseover", function() {
					d3.select(this)
						.classed('hover', true);
				})
				.on("mouseout", function() {
					d3.select(this)
						.classed('hover', false);
				});
		});

		// Add outline for cities
		d3.json("/data/sfgov_bayarea_cities_topo.json", function(json) {
			data = topojson.feature(json, json.objects.layer1).features;

			var cities = svg.append('g')
				.attr('id', 'bay-cities');

			var cities = cities.selectAll("path")
				.data(data)
				.enter().append("svg:path")
				.attr("d", path)
				.attr('fill', 'none')
				.attr('stroke', '#303030')
				.append("svg:title");
		});

		// Show the scale of bubbles on the chart
		// var scale = svg.append("g")
		// 	.attr('id', 'scale');

		// var scale_data = [50000, 10000, 1000];
		// var scale_height = Math.sqrt(scale_data[0])/8;
		// scale.selectAll("circle")
		// 	.data(scale_data)
		// 	.enter()
		// 	.append("circle")
		// 	.attr('cx', 50)
		// 	.attr('cy', function(d) {
		// 		return 50 + scale_height - Math.sqrt(d)/8
		// 	})
		// 	.attr('r', function(d) {
		// 		return Math.sqrt(d)/8;
		// 	})
		// 	.attr('stroke', '#000000')
		// 	.attr('fill', 'none');

		// Add a legend at the bottom!
		var svg_legend = d3.select(chartEl).append("svg")
			.attr("id", "legend")
			.attr("width", width + margin.right)
			.attr("height", margin.bottom);

		var offset = (width + margin.right) / candidates.length;

		var legend = svg_legend.selectAll('.legend')
			.data(candidates)
			.enter().append('g')
			.attr("class", "legend")
			.attr("transform", function(d, i) {
				return "translate(" + i * offset + ",0)";
			});

		legend.append("rect")
			.attr('x', 0)
			.attr('y', 0)
			.attr("width", offset)
			.attr("height", 10)
			.attr("class", function(d) {
				return 'status ' + color(d);
			});

		legend.append("rect")
			.attr("x", 0)
			.attr("y", 10)
			.attr("width", offset)
			.attr("height", 18)
			.attr("class", function(d) {
				return color(d);
			});

		legend.append("text")
			.attr("x", offset / 2)
			.attr("y", 34)
			.attr("dy", ".35em")
			.style("text-anchor", "middle")
			.text(function(d) {
				return d;
			});
	};

	donorZipcode = function(chartEl, data) {
		var app = new App();
		app.init(chartEl, data);
	};

})();