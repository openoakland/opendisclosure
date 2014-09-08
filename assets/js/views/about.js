OpenDisclosure.Views.About = Backbone.View.extend({
  team: [
    { "name" : "Lauren Angius", "github" : "https://github.com/lla2105" },
    { "name" : "Tom Dooner", "github" : "https://github.com/tdooner" },
    { "name" : "Mike Ubell", "github" : "https://github.com/mikeubell" },
    { "name" : "Elina Rubuliak", "github" : "https://github.com/elinaru" },
    { "name" : "Kyle Warneck", "github" : "https://github.com/KyleW" },
    { "name" : "Vivian Brown", "github" : "https://github.com/vbrown608" },
    { "name" : "Ian Root", "github" : "https://github.com/ianaroot" },
    { "name" : "Klein Lieu", "github" : "https://github.com/kleinlieu" },
    { "name" : "Amanda Richardson", "github" : "https://github.com/amandaric" },
    { "name" : "Dave Guarino", "github" : "https://github.com/daguar" },
    { "name" : "John Osborn", "github" : "https://github.com/bayreporta" },
    { "name" : "Phil Wolf", "github" : "https://github.com/evanwolf" },
    { "name" : "Steve 'Spike' Spiker", "github" : "https://github.com/spjika" },
    { "name" : "Luis Aguilar", "github" : "https://github.com/munners17" },
    { "name" : "Emily Bookstein", "github" : "https://github.com/bookstein" },
    { "name" : "Brian Ferrell", "github" : "https://github.com/endenizen" },
    { "name" : "Edward Breen", "github" : "https://github.com/tedbreen" },
    { "name" : "Timothy Kempf", "github" : "https://github.com/Fauntleroy" },
    { "name" : "Ian Rees", "github" : "https://github.com/irees" },
    { "name" : "Jonathan Wrobel", "github" : "https://github.com/jwrobes" },
    { "name" : "Maggie Shine", "github" : "https://github.com/magshi" },
    { "name" : "Sunny Juneja", "github" : "https://github.com/whatasunnyday" }
  ],

  template: _.template("\
   <a href='https://github.com/openoakland/opendisclosure'><img style='position: absolute; top: 0; right: 0; border: 0;' src='https://camo.githubusercontent.com/38ef81f8aca64bb9a64448d0d70f1308ef5341ab/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f6461726b626c75655f3132313632312e706e67' alt='Fork me on GitHub' data-canonical-src='https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png'></a>\
   <section id='about'>\
     <h1>About the Open Disclosure Project</h1>\
     <p class='about'><a href='http://opendisclosure.io'>Open Disclosure</a> is a group of volunteer civic hackers passionate about open data, transparency and shining light on the funding that fuels Oakland’s electoral campaigns. Beginning in 2013 the <a href='http://www2.oaklandnet.com/Government/o/CityAdministration/d/PublicEthics/index.htm'>Oakland Public Ethics Commission</a> partnered with <a href='http://openoakland.org/'> OpenOakland</a> to form the Open Disclosure team for the purpose of ensuring government integrity and transparency in campaign activities by opening up campaign data. Disclosure of campaign finance empowers citizens and strengthens democracy because it keeps government accountable by revealing influential connections, the flow of money in politics, and potential issues with how campaign funds are raised or spent. Open Disclosure’s goal is to introduce a high standard of clarity and transparency to the disclosure of Oakland’s local campaign finance so that the public can understand how local campaigns are financed.</p>\
\
     <p class='about'>Open Disclosure is a project of OpenOakland, a <a href='http://www.codeforamerica.org/'>Code for America</a> citizen brigade that works to improve the lives of Oaklanders by advancing civic innovation and open government through community partnerships, engaged volunteers, and civic technology. OpenDisclosure.io is our team’s site established to easily visualize and simplify <a href='https://data.oaklandnet.com/browse?tags=fppc&utf8=%E2%9C%93&page=1'>campaign finance data for Oakland elections</a>. We want to make this local campaign contribution and spending data easier to find, see, search and understand. We update this data as the local mayoral campaigns submit their latest campaign finance filings to NetFile, Oakland’s campaign finance disclosure database, according to filing deadlines set forth by the <a href='http://www.fppc.ca.gov/'>California Fair Political Practices Commission (FPPC)</a>. We hope that Open Disclosure sheds some light on the dynamic financial foundation that fuels the campaigns of Oakland candidates. Please contact our team if you have any questions: <a href='mailto:oaklandopendisclosure@gmail.com'>oaklandopendisclosure@gmail.com</a>.</p>\
     <p class='about'>All development on OpenDisclosure happens <a href='https://github.com/openoakland/opendisclosure'>publicly on Github</a>. We invite any questions or suggestions for improvement–just create an issue on Github!</p>\
     <h1>Open Disclosure Team</h1>\
     <ul>\
     <% _.each(teammates, function(m) { %>\
       <li><a href='<%= m.github %>'><%= m.name %></a></li>\
     <% }) %>\
     </ul>\
     ...and thanks to everyone else in the <a href='http://openoakland.org'>OpenOakland</a> Code for America Brigade for helping us out.\
     </section>"),

  initialize: function() {
    this.render();
  },

  render: function() {
    this.$el.html(this.template({
      teammates: this.team
    }));
  },
});
