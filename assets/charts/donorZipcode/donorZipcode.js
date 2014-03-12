
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
			if (!amounts[zip]) { amounts[zip] = {}; }
			if (!amounts[zip][candidate]) { amounts[zip][candidate] = 0; }
			amounts[zip][candidate] += amount;

			// Create a list of all candidates
			if (!candidates[candidate]) { candidates[candidate] = true; }
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
				.scale(78000)
				.translate([27400, 2800]));

		var svg = d3.select(chartEl).append("svg")
			.attr("class", "YlOrRd")
			.attr("width", width)
			.attr("height", height)
			
		var zipcodes = svg.append("g")
			.attr("id", "bay-zipcodes");

		var candidate = 'Re-Elect Mayor Quan 2014';

		d3.json("/charts/donorZipcode/bay_area_zip_codes.json", function(json) {

			// Add map regions
			var zips = zipcodes.selectAll("path")
				.data(json.features)
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

			// Add a circle at the center of each zip
			var dorling = circles.selectAll("circle")
				.data(function() {
					return json.features
				})
				.enter()
				.append("circle")
				.each(function(d) { d.properties.c = path.centroid(d); })
				.attr('cx', function(d) { return d.properties.c[0]; })
				.attr('cy', function(d) { return d.properties.c[1]; })
				.attr('r', function(d) {
					if (amounts[d.properties.ZIP]){
						return Math.sqrt( amounts[d.properties.ZIP][candidate] || 0)/5;
					}
					return 0;
				})
				.attr('fill', 'green');
		});

		var cities = svg.append('g')
			.attr('id', 'bay-cities');

		d3.json("/charts/donorZipcode/bay_area_cities.json", function(json) {
			var cit = cities.selectAll("path")
				.data(json.features)
				.enter().append("svg:path")
				.attr("d", path)
				.attr('fill', 'none')
				.attr('stroke', '#303030')
				.append("svg:title")
				.text(function(d) {
					return "" + d.id + ": " + d.properties.name;
				});
		});



	};

	donorZipcode = function(chartEl, data) {
		var app = new App();
		app.init(chartEl, data);
	};

})();