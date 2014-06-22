OpenDisclosure.DailyContributionsChartView = OpenDisclosure.ChartView.extend({

  draw: function(){ 
    console.log("yay!")
    var chart = this;

    chart.data = this.processData(this.collection);

    chart.color = d3.scale.ordinal()
      .domain(chart.data.candidates)
      .range(d3.range(12).map(function(i) {
        return "q" + i + "-12";
      }));


      
      // .attr("width", chart.dimensions.width)
      // .attr("height", chart.dimensions.height)
      // .attr("viewBox", "0 0 " + chart.dimensions.width + " " + chart.dimensions.height)
      // .attr("preserveAspectRatio", "xMidYMid");


  },

  processData: function(data) {
    var tempAmounts = {}
    var amounts = {}
    regex = new RegExp("mayor")
    for (var i = 0; i < data.length; i++) {
      el = data.models[i].attributes
      if (regex.exec( el.recipient.name.toLowerCase() )){
        if (tempAmounts[el.recipient.name]) {
          console.log('broke into first condition')
          if (tempAmounts[el.recipient.name][new Date(el.date)]) {
            console.log('broke into second condition')
            tempAmounts[el.recipient.name][new Date(el.date)] += el.amount
          }
          else {
            console.log('got elsed by second condition')
            tempAmounts[el.recipient.name][new Date(el.date)] = el.amount
            tempAmounts[el.recipient.name][new Date(new Date(el.date) - 300000000)] = 0
            tempAmounts[el.recipient.name][new Date] = 0
          }
        }
        else {
          console.log('got elsed by first condition')
          tempAmounts[el.recipient.name] = {}
          tempAmounts[el.recipient.name][new Date(new Date(el.date) - 300000000)] = 0
          tempAmounts[el.recipient.name][new Date] = 0
          tempAmounts[el.recipient.name][new Date(el.date)] = el.amount;
        }
      }
    }
    var date_sort_asc = function (date1, date2) {
      // This is a comparison function that will result in dates being sorted in
      // ASCENDING order. As you can see, JavaScript's native comparison operators
      // can be used to compare dates. This was news to me.
      date1 = new Date (date1)
      date2 = new Date (date2)
      if (date1 > date2) return 1;
      if (date1 < date2) return -1;
      return 0;
    };

    for (var key in tempAmounts){
      sorted_dates = _.keys(tempAmounts[key]).sort(date_sort_asc)
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

        // App.prototype.tempAmounts = {};

        // App.prototype.amounts = {};
        // App.prototype.xRange = [];
        // App.prototype.yRange = []


        // function App() {
        //     var _this = this;

        //     this.init = _.bind(this.init, this);

        //     d3.csv('assets/data/Mayoral-Candidates-Contribution.csv', this.init);
        // }

        // App.prototype.init = function(data) {
        //     var _this = this;

        //     for (var i = 0; i < data.length; i++) {
        //         var el = data[i],
        //             amount = parseInt(el.Tran_Amt1);
        //         if (this.tempAmounts[el.Filer_NamL]) {
        //           if (this.tempAmounts[el.Filer_NamL][new Date(el.Tran_Date)]) {
        //             this.tempAmounts[el.Filer_NamL][new Date(el.Tran_Date)] += amount
        //           }
        //           else {
        //             this.tempAmounts[el.Filer_NamL][new Date(el.Tran_Date)] = amount
        //             this.tempAmounts[el.Filer_NamL][new Date(new Date(el.Tran_Date) - 300000000)] = 0
        //             this.tempAmounts[el.Filer_NamL][new Date] = 0
        //           }
        //         }
        //         else {
        //             this.tempAmounts[el.Filer_NamL] = {}
        //             this.tempAmounts[el.Filer_NamL][new Date(new Date(el.Tran_Date) - 300000000)] = 0
        //             this.tempAmounts[el.Filer_NamL][new Date] = 0
        //             this.tempAmounts[el.Filer_NamL][new Date(el.Tran_Date)] = amount;
        //         }
        //     }

        //     var date_sort_asc = function (date1, date2) {
        //       // This is a comparison function that will result in dates being sorted in
        //       // ASCENDING order. As you can see, JavaScript's native comparison operators
        //       // can be used to compare dates. This was news to me.
        //       date1 = new Date (date1)
        //       date2 = new Date (date2)
        //       if (date1 > date2) return 1;
        //       if (date1 < date2) return -1;
        //       return 0;
        //     };

        //     for (var key in this.tempAmounts){
        //       sorted_dates = _.keys(this.tempAmounts[key]).sort(date_sort_asc)
        //       this.amounts[key] = []
        //       for (i = 0; i < sorted_dates.length; i ++) {
        //         if (this.tempAmounts[key][sorted_dates[i - 1]]) { 
        //           this.amounts[key].push({date: new Date(sorted_dates[i]), amount: (this.tempAmounts[key][sorted_dates[i]] + this.tempAmounts[key][sorted_dates[i - 1]] ) })
        //           this.tempAmounts[key][sorted_dates[i]] += this.tempAmounts[key][sorted_dates[i - 1]]
        //         }
        //         else {
        //           this.amounts[key].push({date: new Date(sorted_dates[i]), amount: this.tempAmounts[key][sorted_dates[i]]})
        //         }

        //       }
        //     }


        //     for (var key in this.amounts){
        //         var data = this.amounts[key]
        //         if (key =="Patrick McCullough Mayor 2014"){

        //         }
        //         else {
        //             // console.log(data.length)

        //             for (i = 0; i < data.length; i ++){
        //                 var datum = data[i]
        //                 // console.log(datum.date)
        //                 if (this.xRange.indexOf(datum.date) == -1) {
        //                     this.xRange.push(datum.date)
        //                 }
        //                 if (this.yRange.indexOf(datum.amount) == -1) {
        //                     this.yRange.push(datum.amount)
        //                 }

        //             }
        //             // console.log(this.xRange)
        //         }
        //     }

        //     this.xRange.sort(date_sort_asc)



        //     var margin = {top: 20, right: 20, bottom: 30, left: 50},
        //         width = 1200 - margin.left - margin.right,
        //         height = 800 - margin.top - margin.bottom;

        //     var x = d3.time.scale()
        //         .range([0, width]);
        //     var y = d3.scale.linear()
        //         .range([height, 0]);
        //      xAxis = d3.svg.axis()
        //         .scale(x)
        //         .orient("bottom");
        //      yAxis = d3.svg.axis()
        //         .scale(y)
        //         .orient("left");
        //     var line = d3.svg.line()
        //         .x(function(d) { return x(d.date); })
        //         .y(function(d) { return y(d.close); });
        //     var svg = d3.select("body").append("svg")
        //         .attr("width", width + margin.left + margin.right)
        //         .attr("height", height + margin.top + margin.bottom)
        //         .append("g")
        //         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        //         x.domain(d3.extent(this.xRange));
        //         y.domain(d3.extent(this.yRange));
        //     for (var key in this.amounts){
        //         var data = this.amounts[key]
        //         // console.log(key)
        //         if ( data.length <= 1 ){

        //         }
        //         else {
        //         data.forEach(function(d) {
        //             d.close = d.amount
        //         })
        //             svg.append("g")
        //                 .attr("class", "x axis")
        //                 .attr("transform", "translate(0," + height + ")")
        //                 .call(xAxis);
        //             svg.append("g")
        //                 .attr("class", "y axis")
        //                 .call(yAxis)
        //               .append("text")
        //                 .attr("transform", "rotate(-90)")
        //                 .attr("y", 6)
        //                 .attr("dy", ".71em")
        //                 .style("text-anchor", "end")
        //                 .text("Total Raised ($)");
        //             // if(key == "Re-Elect Mayor Quan 2014"){

        //               svg.append("path")
        //                   .datum(data)
        //                   .attr("class", "line")
        //                   .attr("id", key)
        //                   .attr("d", line)
        //                   .text(key)
        //                   ;
        //             // }

        //             // svg.append("text")



        //             // svg.append(key)
        //         }
        //     };


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