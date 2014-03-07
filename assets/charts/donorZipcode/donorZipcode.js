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
        zip = el.Tran_Zip4.substring(0,5);
      
      // Add contributions by zip code
      if (!amounts[zip]) { amounts[zip] = {}; }
      if (!amounts[zip][candidate]) { amounts[zip][candidate] = 0; }
      amounts[zip][candidate] += amount;

      // Create a list of all candidates
      if (!candidates[candidate]) { candidates[candidate] = true; }
    }
    // End of data processing

		var margin = {top: 30, right: 40, bottom: 300, left: 50},
      width = 960 - margin.left - margin.right,
      height = 800 - margin.top - margin.bottom;

		var path = d3.geo.path()
	    .projection(d3.geo.albersUsa()
	    .scale(1030)
	    .translate([580, 340]));

		var svg = d3.select(chartEl).append("svg:svg")
	    .attr("class", "YlOrRd")
	    .attr("width",  width)
	    .attr("height", height)
	    .append('svg:g')
      .attr("transform", "scale(100) translate(-219, -303.5)") 
      ;

		var zipcodes = svg.append("svg:g")
		    .attr("id", "ca-zipcodes");

		// Create a color scale
		// max_donation = d3.max(_.values(amounts['total']));
		// var quantize = d3.scale.quantize()
  //   	.domain([0, max_donation])
  //   	.range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));
  	console.log(_.keys(candidates));
  	var color = d3.scale.ordinal()
  		.domain(_.keys(candidates))
  		.range(d3.range(9).map(function(i) { return "q" + i + "-12"; }));

		d3.json("/charts/donorZipcode/zips-bay-area.json", function(json) {
			zipcodes.selectAll("path")
				.data(json.features)
				.enter().append("svg:path")
				.attr("class", function(d) {
					zip = ""+d.id;
					if (!amounts[zip]) { return ""; }
					candidate_list = _.map(amounts[zip], function(dollars, candidate) { 
						return {name: candidate, amount: dollars}; ;
					});
					max = _.max(candidate_list, function(candidate) { return candidate.amount; });
					console.log(max);
					return color(max.name);
				})
				.attr("d", path)
				.append("svg:title")
				.text(function(d) {
					zip = ""+d.id
					if (amounts['total'][zip]) {
						dollars = amounts['total'][zip];
					} else {
						dollars = 0;
					}
					return d.properties.name + ': ' + zip + ' donated ' + dollars;
				});
		});

	};

	donorZipcode = function(chartEl, data) {
		var app = new App();
		app.init(chartEl, data);
	};

})();