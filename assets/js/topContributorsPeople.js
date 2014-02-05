topContributorsPeople = function() {    
    // var data = [{"label":"1990", "value":16}, 
    //         {"label":"1991", "value":56}, 
    //         {"label":"1992", "value":7},
    //         {"label":"1993", "value":77},
    //         {"label":"1994", "value":22},
    //         {"label":"1995", "value":16},
    //         ];

    //maximum of data you want to use
    var data_max = 80,

    //number of tickmarks to use
    num_ticks = 10,

    //margins
    left_margin = 60,
    right_margin = 60,
    top_margin = 30,
    bottom_margin = 0;

    var w = 500,                        //width
        h = 500,                        //height
        color = function(id) { return '#00b3dc' };

    var x = d3.scale.linear()
        .domain([0, data_max])
        .range([0, w - ( left_margin + right_margin ) ]),
        y = d3.scale.ordinal()
        .domain(d3.range(data.length))
        .rangeBands([bottom_margin, h - top_margin], .5);


    var chart_top = h - y.rangeBand()/2 - top_margin;
    var chart_bottom = bottom_margin + y.rangeBand()/2;
    var chart_left = left_margin;
    var chart_right = w - right_margin;

    var data = []; 

    // Parsing csv file and building contributor array
    d3.csv('assets/data/data.csv', function (d3Data) { 
      for (var i = 0; i < d3Data.length; i++) {
        var firstName = d3Data[i].Tran_NamF,
            lastName = d3Data[i].Tran_NamL, 
            city = d3Data[i].Tran_City, 
            state = d3Data[i].Tran_State, 
            zip = d3Data[i].Tran_Zip
            contribution = d3Data[i].Tran_Amt1;

        var key = (firstName + lastName + city + state + zip).split(' ').join(''); 

        var objectForKey = $.grep(c, function(e){ return e["key"] == key; });

        // We have a new donor!
        if (objectForKey.length === 0) { 

        } else {
            objectForKey["value"] += contribution; 
        }
      }
    });

    /*
     *  Setup the SVG element and position it
     */
    var vis = d3.select("body")
        .append("svg:svg")
            .attr("width", w)
            .attr("height", h)
        .append("svg:g")
            .attr("id", "barchart")
            .attr("class", "barchart")


    //Ticks
    var rules = vis.selectAll("g.rule")
        .data(x.ticks(num_ticks))
    .enter()
        .append("svg:g")
        .attr("transform", function(d)
                {
                return "translate(" + (chart_left + x(d)) + ")";});
    rules.append("svg:line")
        .attr("class", "tick")
        .attr("y1", chart_top)
        .attr("y2", chart_top + 4)
        .attr("stroke", "black");

    rules.append("svg:text")
        .attr("class", "tick_label")
        .attr("text-anchor", "middle")
        .attr("y", chart_top)
        .text(function(d)
        {
        return d;
        });
    var bbox = vis.selectAll(".tick_label").node().getBBox();
    vis.selectAll(".tick_label")
    .attr("transform", function(d)
            {
            return "translate(0," + (bbox.height) + ")";
            });

    var bars = vis.selectAll("g.bar")
        .data(data)
    .enter()
        .append("svg:g")
            .attr("class", "bar")
            .attr("transform", function(d, i) { 
                    return "translate(0, " + y(i) + ")"; });

    bars.append("svg:rect")
        .attr("x", right_margin)
        .attr("width", function(d) {
                return (x(d.value));
                })
        .attr("height", y.rangeBand())
        .attr("fill", color(0))
        .attr("stroke", color(0));


    //Labels
    var labels = vis.selectAll("g.bar")
        .append("svg:text")
            .attr("class", "label")
            .attr("x", 0)
            .attr("text-anchor", "right")
            .text(function(d) {
                    return d.label;
                    });

    var bbox = labels.node().getBBox();
    vis.selectAll(".label")
        .attr("transform", function(d) {
                return "translate(0, " + (y.rangeBand()/2 + bbox.height/4) + ")";
                });


    labels = vis.selectAll("g.bar")
        .append("svg:text")
        .attr("class", "value")
        .attr("x", function(d)
                {
                return x(d.value) + right_margin + 10;
                })
        .attr("text-anchor", "left")
        .text(function(d)
        {
        return "" + d.value + "%";
        });

    bbox = labels.node().getBBox();
    vis.selectAll(".value")
        .attr("transform", function(d)
        {
            return "translate(0, " + (y.rangeBand()/2 + bbox.height/4) + ")";
        });

    //Axes
    vis.append("svg:line")
        .attr("class", "axes")
        .attr("x1", chart_left)
        .attr("x2", chart_left)
        .attr("y1", chart_bottom)
        .attr("y2", chart_top)
        .attr("stroke", "black");
     vis.append("svg:line")
        .attr("class", "axes")
        .attr("x1", chart_left)
        .attr("x2", chart_right)
        .attr("y1", chart_top)
        .attr("y2", chart_top)
        .attr("stroke", "black");
 
};