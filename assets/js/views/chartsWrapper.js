/**
 * Original author: David Eads (https://github.com/eads)
 * 
 * Wrap D3 charting components in a simple Backbone view interface
 *
 * Provides a redrawing path, data sync, and fallback for non-d3 browsers.
 *
 * Views that extend ChartView should implement their own "draw" function and go to work.
 *
 * var collection = new Backbone.Collection([ ["Maria", 33], ["Heather", 29] ]);
 * var view = new MyChartView({ $el: $("#topper-chart"), collection: collection});
 *
 **/

var ChartView = Backbone.View.extend({
  constructor: function(options) {
    this.default_options = {
      base_height: 320,
      breakpoints: {
        // width->height multiplier
        "768": 0.9,
        "420": 0.7
      },
      margin: {
        top: 20,
        right: 30,
        bottom: 30,
        left: 50
      },
      type: ""
    };

    this.options = $.extend(true, this.default_options, options);

    var breakpoints = _.pairs(this.options.breakpoints);
    this.options.breakpoints = _.sortBy(breakpoints, function(item) {
      return Number(item[0]);
    });

    // Fallback if d3 is unavailable, add some formatters otherwise.
    if (!this.d3) {
      this.draw = this.fallback_draw;
    }
    else {
      this.formatNumber = d3.format(".lf");
      this.formatCommas = d3.format(",");
      this.formatPercent = d3.format("%");
    }
    Backbone.View.apply(this, arguments);
  },
  initialize: function(options) {
    // Wrap chart
    this.$el.wrap($('<div class="chart-wrapper">'));
    this.$chart_container = this.$el.parent();
    this.chart_container = this.$chart_container.get(0);
    this.get_dimensions();

    if (this.collection)
      this.collection.on("sync", _.bind(this.render, this));
    else if (this.options.data)
      this.data = this.options.data;

    $(window).on("resize", _.debounce(_.bind(this.render, this), 100));
  },
  get_dimensions: function() {
    var window_width = $(window).width();

    var wrapperWidth = this.$chart_container.width();
    var width = wrapperWidth - this.options.margin.left - this.options.margin.right;
    var height = this.options.base_height - this.options.margin.bottom - this.options.margin.top;

    _.every(this.options.breakpoints, _.bind(function(breakpoint) {
      var width = breakpoint[0];
      if (window_width <= width) {
        var multiplier = breakpoint[1];
        height = (height - this.options.margin.bottom - this.options.margin.top) * multiplier;
        return false;
      }
      return true;
    }, this));

    wrapperHeight = height + this.options.margin.top + this.options.margin.bottom;

    //console.log('VIEW OPTIONS', this.options);
    this.$el
      .height(wrapperHeight)
      ;

    this.dimensions = {
      width: width,
      height: height,
      wrapperWidth: wrapperWidth,
      wrapperHeight: wrapperHeight
    };
  },
  // The render function wraps drawing with responsivosity
  render: function() {
    if (this.collection)
      this.data = this.collection.toJSON();
    this.$el.empty();
    this.get_dimensions();
    this.draw();
  },
  draw: function() {
    console.log("override ChartView's draw function with your d3 code");
    return this;
  },
  fallback_draw: function() {
    this.$el.html(
      '<div class="alert"><p><strong>Warning!</strong> You are using an unsupported browser. ' +
      'Please upgrade to Chrome, Firefox, or Internet Explorer version 9 or higher to view ' +
      'charts on this site.</p></div>');
    return this;
  },
  d3: function() {
    return (typeof d3 !== 'undefined');
  }
});