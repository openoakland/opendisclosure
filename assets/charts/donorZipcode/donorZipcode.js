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
		// End of data processing

		var margin = {
			top: 30,
			right: 40,
			bottom: 300,
			left: 50
		},
			width = 960 - margin.left - margin.right,
			height = 800 - margin.top - margin.bottom;

		var path = d3.geo.path()
			.projection(d3.geo.albersUsa()
				.scale(48000)
				.translate([17000, 1800]));

		var svg = d3.select(chartEl).append("svg:svg")
			.attr("class", "YlOrRd")
			.attr("width", width)
			.attr("height", height)
			.append('svg:g')
			
		var zipcodes = svg.append("svg:g")
			.attr("id", "ca-zipcodes");

		d3.json("/charts/donorZipcode/zips-bay-area.json", function(json) {

			// Add map regions
			var zips = zipcodes.selectAll("path")
				.data(json.features)
				.enter().append("svg:path")
				.attr("id", function(d) {
					zip = "" + d.id;
				})
				.attr("d", path)
				.append("svg:title")
				.text(function(d) {
					zip = "" + d.id
				});

			// Add a circle at the center of each zip
			var dorling = d3.select(chartEl).select('svg')
				.selectAll("circle")
				.data(function() {
					return json.features
				})
				.enter()
				.append("circle")
				.each(function(d) { d.properties.c = path.centroid(d); })
				.attr('cx', function(d) { return d.properties.c[0]; })
				.attr('cy', function(d) { return d.properties.c[1]; })
				.attr('r', function(d) {
					return 10;
				})
				.attr('fill', 'green');
		});



	};

	donorZipcode = function(chartEl, data) {
		var app = new App();
		app.init(chartEl, data);
	};

})();