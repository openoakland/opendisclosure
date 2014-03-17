(function() {

  var chartDiv;
  var sidebar;

  function injectScript(src, onLoad, onError) {
    var headEl = document.getElementsByTagName("head")[0];
    var script = document.createElement('script');

    script.type = 'text/javascript';
    script.src = src;
    script.async = true;

    if (onLoad) {
      // onreadystatechange for old versions of IE
      script.onload = script.onreadystatechange = function() {
        if (script.readyState &&
          script.readyState != 'complete' && script.readyState != 'loaded') {
          return;
        }
        script.onload = script.onreadystatechange = null;
        onLoad(src);
      };
    }
    // This doesn't work in IE and there's no way to make it work in IE, but
    // it will allow error handling for everybody else.
    if (onError) {
      script.onerror = onError;
    }

    headEl.appendChild(script);

    return script;
  }

  function injectCss(filename) {
    var fileref = document.createElement("link");
    fileref.setAttribute("rel", "stylesheet");
    fileref.setAttribute("type", "text/css");
    fileref.setAttribute("href", filename);
    document.getElementsByTagName("head")[0].appendChild(fileref)
  }

  function createChart(chart, data) {
    // Create container for this chart.
    var chartEl = $('<div></div>').attr('id', 'chart-' + chart.id);
    chartDiv.append(chartEl);

    injectScript('/charts/' + chart.id + '/' + chart.id + '.js', function() {
      // Each chart should have a global function defined that takes an element and data as arguments
      if (window[chart.id]) {
        console.log('Creating chart "' + chart.id + '".');

        // Load css (may not exist but that's fine)
        injectCss('/charts/' + chart.id + '/' + chart.id + '.css');

        // Load js and create the chart
        window[chart.id](chartEl[0], data);
      } else {
        console.error('Couldn\'t find chart "' + chart.id + '".');
      }
    });
  }

  function createNavLink(chart) {
    // Create container
    var linkHolder = $('<li></li>');

    // Create link
    var link = $('<a></a>').attr('href', '#chart-' + chart.id);
    link.text(chart.description);

    // Add link to container
    linkHolder.append(link);

    // Attach container to sidebar
    sidebar.find('ul').append(linkHolder);
  }

  function setupHandlers() {
    $('body').scrollspy({ target: '#sidebar' });

    // SMOOTH SCROLLING FROM PAULUND.CO.UK
    $('a[href^="#"]').on('click',function (e) {
      e.preventDefault();

      var target = this.hash,
        $target = $(target);

      $('html, body').stop().animate({
        'scrollTop': $target.offset().top
      }, 900, 'swing', function () {
        window.location.hash = target;
      });
    });
  }

  function start() {
    chartDiv = $('#charts');
    sidebar = $('#sidebar');

    d3.csv('/data/data.csv', function(data) {
      _.each(charts, function(chart) {
        // Preserve data - chart may want to rearrange things internally.
        var newData = _.clone(data);
        createChart(chart, newData);
        createNavLink(chart);
      });
      setupHandlers();
    });
  }

  $(document).ready(function() {
    if (typeof window.charts !== 'undefined') {
      start();
    }
  });

  // Adding this bit for the search feature on the contributors page
  // Adding as a separate bit to make it easier to remove if something
  // breaks due to its inclusion.
  $(document).ready(function(){
    $('#contributor').keyup(function() {
      var filterval = $('#contributor').val().trim().toLowerCase();
      $('li.contrib').each(function() {
        var check_name = $(this).first('a').text().trim().toLowerCase();
        if ( check_name.indexOf(filterval) >= 0 ) {
          // $(this).css('background-color','cyan');
          $(this).show();
        } else {
          // $(this).css('background-color','magenta');
          $(this).hide();
        }
      });
    });
  });

})();
