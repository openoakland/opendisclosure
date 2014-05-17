
OpenDisclosure.ChartsView = Backbone.View.extend({

  initialize: function(){

    this.listenTo(this.collection, 'sync', this.render);

  },

  createChart: function (chart, data) {

    // Create container for this chart.
    var chartEl = $('<div></div>').attr('id', 'chart-' + chart.id);
    this.chartDiv.append(chartEl);

    this.injectScript('/charts/' + chart.id + '/' + chart.id + '.js', function(src) {

      // Each chart should have a global function defined that takes an element and data as arguments
      if (window[chart.id]) {
        console.log('Creating chart "' + chart.id + '".');

        // Load css (may not exist but that's fine)
        OpenDisclosure.ChartsView.prototype.injectCss('/charts/' + chart.id + '/' + chart.id + '.css');
        // Load js and create the chart
        window[chart.id](chartEl[0], data);
      } else {
        console.error('Couldn\'t find chart "' + chart.id + '".');
      }
    });
  },

  // createNavLink: function(chart) {
  //   // Create container
  //   var linkHolder = $('<li></li>');

  //   // Create link
  //   var link = $('<a></a>').attr('href', '#chart-' + chart.id);
  //   link.text(chart.description);

  //   // Add link to container
  //   linkHolder.append(link);

  //   // Attach container to sidebar
  //   this.sidebar.find('ul').append(linkHolder);
  // },

  injectCss: function (filename) {
    console.log('injectCss running for ', filename);
    var fileref = document.createElement("link");
    fileref.setAttribute("rel", "stylesheet");
    fileref.setAttribute("type", "text/css");
    fileref.setAttribute("href", filename);
    document.getElementsByTagName("head")[0].appendChild(fileref);
  },

  injectScript: function (src, onLoad, onError) {
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
  },

  setupHandlers: function() {
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
  },

  render: function(){
    console.log('rendering charts');
    if (typeof window.charts !== 'undefined') {
      this.chartDiv = $('#charts');
      this.sidebar = $('#sidebar');

      that = this;
      _.each(charts, function(chart) {
        that.createChart(chart, that.collection);
        // that.createNavLink(chart); // Commented out since we're not currently showing charts on nav - KW
      });

      this.setupHandlers();
    }
  }

});