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

OpenDisclosure.ChartView = Backbone.View.extend({
  constructor: function(options) {
    this.default_options = {
      base_width: 700,
      aspect: .6,
      margin: {
        top: 10,
        right: 0,
        bottom: 15,
        left: 0
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
    } else {
      this.formatNumber = d3.format(".lf");
      this.formatCommas = d3.format(",");
      this.formatPercent = d3.format("%");
    }
    Backbone.View.apply(this, arguments);
  },
  initialize: function(options) {
    this.get_dimensions();

    if (this.collection.length > 0) {
      this.render();
    } else if (this.options.data) {
      this.data = this.options.data;
    }

    this.collection.listenTo(this.collection, 'sync', function(e) {
      this.render();
    }.bind(this));

    $(window).on("resize", function() {
      this.resize();
    }.bind(this));
  },
  resize: function() {
    this.get_dimensions();
    this.$el.find('svg').attr("width", this.dimensions.width);
    this.$el.find('svg').attr("height", this.dimensions.height);
  },
  get_dimensions: function() {
    var window_width = $(window).width();

    var wrapperWidth = this.$el.width();
    var width = wrapperWidth - this.options.margin.left - this.options.margin.right;
    var height = wrapperWidth*this.options.aspect - this.options.margin.bottom - this.options.margin.top;

    wrapperHeight = height + this.options.margin.top + this.options.margin.bottom;

    // this.$el
    //   .height(wrapperHeight);

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
    this.draw(this.el);
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
