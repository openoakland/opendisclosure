(function() {
    
    this.ContributorLocation = (function() {

        App.prototype.amounts = {};

        function App() {
            var _this = this;

            this.init = _.bind(this.init, this);

            d3.csv('assets/data/mayoral_contributions_A.csv', this.init);
        }

        App.prototype.init = function(data) {
            var _this = this;

            for (var i = 0; i < data.length; i++) {
                var el = data[i],
                    amount = parseInt(el.Tran_Amt1),
                    candidate = el.Filer_NamL,
                    city = el.Tran_City,
                    state = el.Tran_State;

                if (!this.amounts[candidate]) {
                	this.amounts[candidate] = {
                		'total' : 0,
                		'oakland' : 0,
                		'california' : 0
                	};
                }
                this.amounts[candidate]['total'] += amount;
                	if (state == 'CA') {
                		this.amounts[candidate]['california'] += amount;
	                	if (city == 'Oakland') {
	                		this.amounts[candidate]['oakland'] += amount;
	                	} 
             	}
            }
            //console.log(this.amounts);

            data = _.collect(this.amounts, function(v, k) 
            	{ return {name: k, total: v['total'], oakland: v['oakland'], california: v['california']} });
            data = _.sortBy(data, function(el) { return -el.oakland; });
            data = _.filter(data, function(el) { return !isNaN(el.total); });
            //console.log(data);


            var margin = {top: 30, right: 40, bottom: 300, left: 50},
                width = 960 - margin.left - margin.right,
                height = 800 - margin.top - margin.bottom;

            var formatDollar = d3.format("$.0");

            var x = d3.scale.ordinal()
                .rangeRoundBands([0, width], .1);

            var y = d3.scale.linear()
                .range([height, 0]);

            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left")
                .tickFormat(formatDollar);

            var svg = d3.select("body").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
              .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            
            x.domain(data.map(function(d) { return d.name; }));
            y.domain([0, d3.max(data, function(d) { return d.total; })]);

            svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis)
              .selectAll("text")
              .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", function(d) {
                return "rotate(-65)" 
                });

            svg.append("g")
              .attr("class", "y axis")
              .call(yAxis)
            .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
              .text("Dollar amount");


			var valgroup = svg.selectAll('g.valgroup')
    			.data(data)
			.enter().append('g')
  				.attr('class', 'g')
  				.attr("transform", function(d) { return "translate(" + x(d.name) + ",0)"; });

  			var colors = ['pink', 'purple', 'red']

  			valgroup.selectAll('rect')
  				.data( function(d) { return [d.total, d.california, d.oakland]; })
  			.enter().append('rect')
  				.attr('width', x.rangeBand())
  				.attr('y', function(d) { return y(d); })
  				.attr('height', function(d) { return height - y(d); })
  				.attr('fill', function(d, i) { 
  					return colors[i];
  				});

            // svg.selectAll(".bar")
            //   .data(data)
            // .enter().append("rect")
            //   .attr("class", "bar")
            //   .attr("x", function(d) { return x(d.name); })
            //   .attr("width", x.rangeBand())
            //   .attr("y", function(d) { return y(d.oakland); })
            //   .attr("height", function(d) { return height - y(d.oakland); });






            function type(d) {
              d.frequency = +d.frequency;
              return d;
            }

        }

        return App;
    })();

}).call(this);