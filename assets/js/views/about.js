OpenDisclosure.AboutView = Backbone.View.extend({

  template: _.template("\
		       <section id='about'>\
 		       <h1>About Us<h1/>\
		       <p class='about'><a href='http://opendisclosure.io'>Open Disclosure</a> is a group of volunteer civic hackers passionate about open data, transparency and shining light on the funding that fuels Oakland’s electoral campaigns. Beginning in 2013 the <a href='http://www2.oaklandnet.com/Government/o/CityAdministration/d/PublicEthics/index.htm'>Oakland Public Ethics Commission</a> partnered with <a href='http://openoakland.org/'> OpenOakland</a> to form the Open Disclosure team for the purpose of ensuring government integrity and transparency in campaign activities by opening up campaign data. Disclosure of campaign finance empowers citizens and strengthens democracy because it keeps government accountable by revealing influential connections, the flow of money in politics, and potential issues with how campaign funds are raised or spent. Open Disclosure’s goal is to introduce a high standard of clarity and transparency to the disclosure of Oakland’s local campaign finance so that the public can understand how local campaigns are financed.</p>\
\
		       <p class='about'>Open Disclosure is a project of OpenOakland, a <a href='http://www.codeforamerica.org/'>Code for America</a> citizen brigade that works to improve the lives of Oaklanders by advancing civic innovation and open government through community partnerships, engaged volunteers, and civic technology. OpenDisclosure.io is our team’s site established to easily visualize and simplify <a href='https://data.oaklandnet.com/browse?tags=fppc&utf8=%E2%9C%93&page=1'>campaign finance data for Oakland elections</a>. We want to make this local campaign contribution and spending data easier to find, see, search and understand. We update this data as the local mayoral campaigns submit their latest campaign finance filings to NetFile, Oakland’s campaign finance disclosure database, according to filing deadlines set forth by the <a href='http://www.fppc.ca.gov/'>California Fair Political Practices Commission (FPPC)</a>. We hope that Open Disclosure sheds some light on the dynamic financial foundation that fuels the campaigns of Oakland candidates. Please contact our team if you have any questions: <a href='mailto:oaklandopendisclosure@gmail.com'>oaklandopendisclosure@gmail.com</a>.</p>\
		       </section>\
     "),

  initialize: function(){
      this.render();
  },

  render: function(){
    $('.main').empty();
    $('.main').html(this.template());

  },

});
