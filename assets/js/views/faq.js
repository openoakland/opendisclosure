OpenDisclosure.Views.Faq = Backbone.View.extend({
  template: _.template("\
    <div id='faq'>\
      <h1>Frequently Asked Questions</h1>\
      <section class='someSection'>\
        <a name='section1Name'></a>\
        <div class='question'>\
          <h3>What data is featured on this website?</h3>\
          <p>\
          Open Disclosure features campaign finance data for all Oakland mayoral candidates that have been certified by the Oakland City Clerk to be placed on the November 2014 ballot. This campaign finance data has been self-reported by all Oakland mayoral candidate-controlled committees.\
          </p>\
        </div>\
        <div class='question'>\
          <h3>How up-to-date is the data?</h3>\
          <p>\
          The data for Open Disclosure is based on campaign finance filing deadlines established by the State of California Fair Political Practices Commission (FPPC) for all state and local candidates running in the November 2014 election.\
          </p>\
          <table class='.reportingPeriods'>\
            <th>Reporting Period</th><th>FPPC Filing Deadline</th>\
            <tr><td>1/1/2014 – 6/30/14</td><td>July 31, 2014</td></tr>\
            <tr><td>7/1/14 – 9/30/14</td><td>October 6, 2014</td></tr>\
            <tr><td>10/1/14 – 10/18/14</td><td>October 23, 2014</td></tr>\
            <tr><td>10/19/14 – 12/31/14</td><td>February 2, 2015</td></tr>\
          </table>\
          <p>\
          Once the filing deadline has elapsed the Open Disclosure team works hard to integrate all of the new data to reflect the most accurate campaign finance data for Oakland’s 2014 mayoral election.\
          </p>\
        </div>\
        <div class='question'>\
          <h3>Where does the data come from?</h3>\
          <p>\
            The campaign finance data that Open Disclosure presents derives from the FPPC Form 460. The Form 460 is a required form for all state and local recipient committees, including Candidates, Ofﬁceholders and Their Controlled Committees. A candidate or ofﬁceholder who has a controlled committee, or who has raised or spent or will raise or spend $1,000 or more during a calendar year in connection with election to ofﬁce or holding ofﬁce. The Form 460 is also required if $1,000 or more will be raised or spent during the calendar year at the behest of the ofﬁceholder or candidate (Source: FPPC).\
          </p>\
          <p>\
            Oakland committees file the Form 460 with the Oakland Office of the City Clerk’s e-filing system NetFile.  See <a href='http://www.google.com/url?q=http%3A%2F%2Fnf4.netfile.com%2Fpub2%2FDefault.aspx%3Faid%3DCOAK&sa=D&sntz=1&usg=AFQjCNElhRgewHgLOBsNpc8ugFW0K4hoPA'>NetFile</a> to view the candidates’ Form 460 Report PDFs and to download the raw data.  The raw data is also synced daily to the <a href='https://www.google.com/url?q=https%3A%2F%2Fdata.oaklandnet.com%2Fdataset%2FCampaign-Finance-FPPC-Form-460-Schedule-A-Monetary%2F3xq4-ermg&sa=D&sntz=1&usg=AFQjCNEz_dnCulumDZY74QIkXgshgYqPhw'>City of Oakland’s Socrata Open Data Portal.</a>\
          </p>\
	</div>\
        <div class='question'>\
          <a name='whoMustFile'></a>\
	  <h3>Who has to file campaign finance data?</h3>\
	  <p>\
	  A candidate only has to file campaign finance forms if the candidate-controlled committee has raised or spent or will raise or spend $1,000 or more during a calendar year in connection with election to office or holding office.\
	  </p>\
        <div class='question'>\
          <a name='fromOakland'></a>\
	  <h3>What is the basis of calculating the proprotion from Oakland?</h3>\
	  <p>\
	  Candidates must itemize contributions that are greater than $100.  They provide information on where the person or company contributing is located. The percentage is the proportion of contributions reported to be from Oakland divided by the total of the itemized contributions.  We remove contributions and loans made by the candidate to the campaign from this calculation.  An early version of this column displayed the proportion of the number of contributions from outside Oakland but it is thought the value of the contributions is more interesting.  Previously the number failed to remove non-itemized contributions from the total and therefore under represented the proportion known to be from Oakland.\
	  </p>\
	  </div>\
        </div>\
        <div class='question'>\
          <a name='smallContributions'></a>\
	  <h3>What is a small contribution?</h3>\
	  <p>\
	  Candidates are required to itemize all contributions of $100 or more. They report the total of all contributions regardless of size.  We categorize all itemized contributions less than $100 and all contributions that were not itemized as small contributions.\
	  </p>\
	</div>\
        <div class='question'>\
          <a name='categoryChart'></a>\
          <h3>What is displayed in the category pie chart?</h3>\
	  <div class='col-sm-2'><img src='pie.jpg' hight='100' width='100'></div>\
          <div class='col-sm-10'><p>\
	  This chart displays the proportion of funds collected by the candidate from individuals, companies, committees, unions and registered Oakland lobbyists and lobbying companies.  The proportion of money not itemized is also displayed.  Candidates do not need to itemize individual contributions that are less than $100.  Lobbyists are identified from the <a href='https://data.oaklandnet.com/Public-Services/2014-Lobbyist-Directory/7jq6-spyn?category=Public-Services&view_'> 2041 lobbyist directory</a>.  Unions are identified “by hand” from the names of the contributors. Unlike the Top Contributors display, employees are NOT aggregated with their employers. Candidates contributions to themselves are not included.\
	  </p></div>\
	</div>\
        <div class='question'>\
          <a name='groupBy'></a>\
          <h3>How do you group by business and employer?</h3>\
          <p>\
            Campaign finance data is complex. Some contributions come from individuals. Others come from companies, unions or other advocacy groups. Candidate committees file contribution information which specifies if the contribution is from an individual or a company or committee. If the contribution is from an individual the committee reports the employer reported by that individual. People may specify their employer in a varity of ways. For example, 'IBM' can also be called 'International Business Machines' or 'Internaltion Buisness Machines Inc'. We did our best to map different names for the same company together. For each company in the list we group contributions from that company with contributions from employees who reported that they work for that company.\
          </p>\
	  <p>\
	  Some people report that they have no employer.  They often report they are self-employed, unemployed, retired or work within the home. We group these people into these categories in this display. For people how don't report an employer and are not in these categories we use their occupation instead, which often may have specified one of these categories.\
	</p>\
        </div>\
        <div class='question'>\
          <h3>How is this data presented?</h3>\
          <p>\
            The data is presented as reported by the candidate-controlled committee.  Open Disclosure does not clean, scrub, or edit the data.  If there are misspellings or duplicate entries then that was how the committee reported the campaign finance data. Where necessary we may aggregate data that we believe represents the same entity.\
          </p>\
        </div>\
        <div class = 'question'>\
          <h3>Who do I contact if I believe any of the data is incorrect?</h3>\
          <p>Please contact the <a href='mailto:oaklandopendisclosure@gmail.com' target='_top'>Open Disclosure team</a> if you believe any of the data or candidate information is incorrect.  We want to get public feedback and definitely be notified if any errors are present. Thank you!\
          </p>\
        </div>\
      </section>\
    </div>"),

  initialize: function(options) {
    this.render();
  },

  render: function() {
    this.$el.html(this.template());
  }

});
