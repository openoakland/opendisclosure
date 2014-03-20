
  var contribs = false;

  function loadContribs () {
    if ( ! contribs ) {
      return false;
    }
    return contribs;
  }

  function render_chart(contribdata) {
    // Conventionally, the "width" and "height" of a D3 figure
    // excludes margins, so the container element's width and
    // height constitute an "outer" height.  Margins are any
    // object with "top", "left", "right", and "bottom" properties.
    //
    // Here we select and size the basic SVG element to prepare
    // it for population.
    var outerwidth = 900, outerheight=500,
      margin = {top:20, right: 30, bottom: 30, left: 40},
      innerwidth = outerwidth - margin.left - margin.right,
      innerheight = outerheight - margin.top - margin.bottom;
    var chart = d3.select(".chart")
        .attr("width", innerwidth + margin.left + margin.right)
        .attr("height", innerheight + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
  }

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
      });
      var con_amt_template = Handlebars.compile($('#con_amt_tpl').html());
      /*
       * Collect a distribution of contribution sums by
       * the contributor type.  Dump info via template.
       */
      var ctype_amt_stat = VDT.collate_statistic(contribs['contrib'],
	function(x) { return x['contributor_type']; },
        function(x) { return x['amount']; });
      var ctype_amt_ctx = { 's': ctype_amt_stat };
      var ctype_amt_html = con_amt_template(ctype_amt_ctx);
      $("#ctype_amt_output").html(ctype_amt_html);
      /*
       * Collect a distribution of contribution sums by
       * the name of the contributor.  Dump info via template.
       */
      var con_amt_stat = VDT.collate_statistic(contribs['contrib'],
	function(x) { return x['_contributor']['name']; },
        function(x) { return x['amount']; });
      var con_amt_ctx = { 's': con_amt_stat };
      var con_amt_html = con_amt_template(con_amt_ctx);
      $("#con_amt_output").html(con_amt_html);

      // matrix
      var ctype_mat = VDT.collate_matrix(contribs['contrib'],
	function(x) { return x['contributor_type']; },
	function(x) { return x['recipient_type']; },
        function(x) { return x['amount']; });
      var qq = 0;
      alert('ah');
    });
  });
