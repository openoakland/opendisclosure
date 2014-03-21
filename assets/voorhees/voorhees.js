
  var contribs = false;

  function loadContribs () {
    if ( ! contribs ) {
      return false;
    }
    return contribs;
  }

  function render_chart(chartdata) {
    // Conventionally, the "width" and "height" of a D3 figure
    // excludes margins, so the container element's width and
    // height constitute an "outer" height.  Margins are any
    // object with "top", "left", "right", and "bottom" properties.
    //
    // Here we select and size the basic SVG element to prepare
    // it for population.
    function data_key(elt) {
      return elt['key'];
    }

    function data_value(elt) {
      return elt['total'];
    }

    var outerwidth = 600, outerheight=400,
      margin = {top:20, right: 30, bottom: 30, left: 40},
      innerwidth = outerwidth - margin.left - margin.right,
      innerheight = outerheight - margin.top - margin.bottom;
    var chart = d3.select(".chart")
        .attr("width", innerwidth + margin.left + margin.right)
        .attr("height", innerheight + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate("
                           + String(margin.left + innerwidth / 2) + ","
                           + String(margin.top +innerheight / 2) + ")");

    var radius = innerheight / 2;

    var pie = d3.layout.pie()
      .sort(null)
      .value(function(d) { return d.total; });

    var arc = d3.svg.arc()
      .outerRadius(radius * 0.8)
      .innerRadius(radius * 0.4);
    var labelArc = d3.svg.arc()
      .outerRadius(radius * 0.9)
      .innerRadius(radius * 0.9);
    var innerTickArc = d3.svg.arc()
      .outerRadius(radius * 0.82)
      .innerRadius(radius * 0.82);
    var outerTickArc = d3.svg.arc()
      .outerRadius(radius * 0.87)
      .innerRadius(radius * 0.87);

    var color = d3.scale.category10();
    /* -- PIE SLICES -- */
    var g = chart.selectAll(".arc")
        .data(pie(chartdata))
      .enter().append("g")
        .attr("class", "arc");

    g.append("path")
      .attr("d",arc)
      .style("fill", function(d,i) { return color(i); });

    function midAngle(d) {
      return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }

    /* -- LABEL LINES -- */
    g.append("polyline")
        .attr("points", function(d) {
                return [innerTickArc.centroid(d), outerTickArc.centroid(d)];
            })
        .attr("stroke", "black");


    /* -- TEXT LABELS -- */
    g.append("text")
        .attr("transform", function(d) {
	    return "translate(" + labelArc.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .style("text-anchor", function(d) {
               return midAngle(d) < Math.PI ? "start" : "end";
             })
        .text(function(d) {
            return d.data.key + " (" + d.data.total + ")"; });


    var qqq = 0;
  }

  function render_list_templates(cdata) {
      /*
       * Collect a distribution of contribution sums by
       * the contributor type.  Dump info via template.
       */
      var ctype_amt_template = Handlebars
	    .compile($('#con_amt_full_tpl').html());
      var ctype_amt_stat = VDT.collate_statistic(cdata['contrib'],
	function(x) { return x['contributor_type']; },
        function(x) { return x['amount']; });
      var ctype_amt_ctx = { 's': ctype_amt_stat };
      var ctype_amt_html = ctype_amt_template(ctype_amt_ctx);
      $("#ctype_amt_output").html(ctype_amt_html);
      var ctype_to_chart = [];
      $(Object.keys(ctype_amt_stat['collated'])).each(function(i,d) {
        ctype_to_chart.push(ctype_amt_stat['collated'][d]);
      });
      render_chart(ctype_to_chart);
      /*
       * Collect a distribution of contribution sums by
       * the name of the contributor.  Dump info via template.
       */
      var con_amt_template = Handlebars.compile($('#con_amt_short_tpl').html());
      var con_amt_stat = VDT.collate_statistic(cdata['contrib'],
	function(x) { return x['_contributor']['name']; },
        function(x) { return x['amount']; });
      var con_amt_ctx = { 's': con_amt_stat };
      var con_amt_html = con_amt_template(con_amt_ctx);
      $("#con_amt_output").html(con_amt_html);
  };

  $().ready(function() {
    $.getJSON("/alltables", function(dat) {
      contribs = dat;
      var t_src = $("#showelt").html();
      var t_template = Handlebars.compile(t_src);
      $.each(dat['contrib'], function(idx,wut) {
        var wut_ctx = {
          // blob: JSON.stringify(wut),
          c: wut
        };
        // $("#output").append(t_template(wut_ctx));
      }); // END $.each( ...
      render_list_templates(contribs);
    }); // end $.getJSON call
  });

