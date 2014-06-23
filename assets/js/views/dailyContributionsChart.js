OpenDisclosure.DailyContributionsChartView = OpenDisclosure.ChartView.extend({
    el: '#daily-contributions-chart',


  dateSortAsc: function (date1, date2) {
    // This is a comparison function that will result in dates being sorted in
    // ASCENDING order. As you can see, JavaScript's native comparison operators
    // can be used to compare dates. This was news to me.
    date1 = new Date (date1)
    date2 = new Date (date2)
    if (date1 > date2) return 1;
    if (date1 < date2) return -1;
    return 0;
  },

  draw: function(){ 
    var xRange = []
    var yRange = []
    var chart = this;

    chart.data = this.processData(this.collection);

    // chart.color = d3.scale.ordinal()
    //   .domain(chart.data.candidates)
    //   .range(d3.range(12).map(function(i) {
    //     return "q" + i + "-12";
    //   }));


      //SETTING SCALE
    for (var key in chart.data){
      if ( chart.data[key].length > 1 ){
        for ( i = 0; i < chart.data[key].length; i ++ ){
          var datum = chart.data[key][i]
          if (xRange.indexOf(datum.date) == -1) {
            xRange.push(datum.date)
          }
          if (yRange.indexOf(datum.amount) == -1) {
            yRange.push(datum.amount)
          }
        }
      }
    }
    xRange.sort(this.dateSortAsc)
      //SETTING SCALE  


    var margin = {top: 20, right: 20, bottom: 30, left: 50},
      width = 1200 - margin.left - margin.right,
      height = 800 - margin.top - margin.bottom;

    var x = d3.time.scale()
      .range([0, chart.dimensions.width]);

    var y = d3.scale.linear()
      .range([chart.dimensions.height, 0]);

     xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

     yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

    var line = d3.svg.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.close); });

    chart.svg = d3.select(chart.el).append("svg")
      .attr("width", chart.dimensions.width)
      .attr("height", chart.dimensions.height)
      .attr("viewBox", "0 0 " + chart.dimensions.width + " " + chart.dimensions.height)
      .attr("preserveAspectRatio", "xMidYMid")
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(d3.extent(xRange));
    y.domain(d3.extent(yRange));
    for (var key in chart.data){
      var data = chart.data[key]
      if ( data.length <= 1 ){

      }
      else {
      data.forEach(function(d) {
        d.close = d.amount
      })
      chart.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + chart.dimensions.height + ")")
        .call(xAxis);

      chart.svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Total Raised ($)");

      chart.svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("id", key)
        .attr("d", line)
        .text(key);
      }
    };

  },

  processData: function(data) {
    var tempAmounts = {}
    var amounts = {}
    var regex = new RegExp("mayor")
    for (var i = 0; i < data.length; i++) {
      if (data.models[i].attributes ){
        el = data.models[i].attributes
        if (regex.exec( el.recipient.name.toLowerCase() )){
          if (tempAmounts[el.recipient.name]) {
            if (tempAmounts[el.recipient.name][new Date(el.date)]) {
              tempAmounts[el.recipient.name][new Date(el.date)] += el.amount
            }
            else {
              tempAmounts[el.recipient.name][new Date(el.date)] = el.amount
              tempAmounts[el.recipient.name][new Date(new Date(el.date) - 300000000)] = 0
              tempAmounts[el.recipient.name][new Date] = 0
            }
          }
          else {
            tempAmounts[el.recipient.name] = {}
            tempAmounts[el.recipient.name][new Date(new Date(el.date) - 300000000)] = 0
            tempAmounts[el.recipient.name][new Date] = 0
            tempAmounts[el.recipient.name][new Date(el.date)] = el.amount;
          }
        }
      }
    }

    for (var key in tempAmounts){
      sorted_dates = _.keys(tempAmounts[key]).sort(this.dateSortAsc)
      amounts[key] = []
      for (i = 0; i < sorted_dates.length; i ++) {
        if (tempAmounts[key][sorted_dates[i - 1]]) { 
          amounts[key].push({date: new Date(sorted_dates[i]), amount: (tempAmounts[key][sorted_dates[i]] + tempAmounts[key][sorted_dates[i - 1]] ) })
          tempAmounts[key][sorted_dates[i]] += tempAmounts[key][sorted_dates[i - 1]]
        }
        else {
          amounts[key].push({date: new Date(sorted_dates[i]), amount: tempAmounts[key][sorted_dates[i]]})
        }

      }
    }
    return amounts
  }
})

        // App.prototype.appendButtons = function(){
        //     for (var key in this.amounts){
        //         buttonDiv = document.getElementById('buttons')
        //         buttonDiv.append("<input class='update_dates_graph' type='button' value=" + key + " data-key=" + key + ">")
        //     }
        // }

        // App.prototype.updateData = function(key) {
        //     // console.log(key)

        //         // x.domain(d3.extent(this.xRange));
        //         // y.domain(d3.extent(this.yRange));

        //     if ( document.getElementById(key) ){
        //         document.getElementById(key).remove()
        //     } else {

        //         data = this.amounts[key]
        //             data.forEach(function(d) {
        //                 d.close = d.amount
        //             })

        //         var svg = d3.select("g")
        //                 svg.append("path")
        //                     .datum(data)
        //                     .attr("class", "line")
        //                     .attr("id", key)
        //                     .attr("d", line);
        //     }
        //   }

        // }