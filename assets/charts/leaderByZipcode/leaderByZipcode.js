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
				zip = el.Tran_Zip4.substring(0, 5);

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
		var max_by_zip = {};
		_.map(amounts, function(val, zip) {
			var candidate_list = _.map(val, function(donation, candidate) {
				return { 'name' : candidate,
								 'total' : donation }
			});
			//console.log(candidate_list);
			var max =  _.max(candidate_list, function(candidate) {
				return candidate.total;
			});
			max_by_zip[zip] = max.name;
		});
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
				.attr('class', function(d) {
					var leader = max_by_zip[d.properties.ZIP];
					return leader? color(leader) : 'null';
				})//'#d3d3d3')
				.attr('stroke', '#9c9c9c')
				.append("svg:title")
				.text(function(d) {
					return d.properties.ZIP + ": " + d.properties.PO_NAME;
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

		// Add a legend at the bottom
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
			.attr("x", 0)
			.attr("y", 0)
			.attr("width", offset)
			.attr("height", 18)
			.attr("class", function(d) {
				return color(d);
			});

		legend.append("text")
			.attr("x", offset / 2)
			.attr("y", 24)
			.attr("dy", ".35em")
			.style("text-anchor", "middle")
			.text(function(d) {
				return d;
			});
	};

	leaderByZipcode = function(chartEl, data) {
		var app = new App();
		app.init(chartEl, data);
	};

})();