OpenDisclosure.App = Backbone.Router.extend({
  routes: {
    '': 'home',
    'about': 'about',
    'candidate/:name': 'candidate',
    'faq':'faq',
    'rules': 'rules',
    'contributor/:id': 'contributor',
    'employer/:employer_name/:employer_id': 'employer',
    'search/:name': 'search',
    'searchCommittee/:name': 'searchCommittee'
  },

  initialize : function() {
    // Store all the data globally, as a convenience.
    //
    // We should try to minimize the amount of data we need to fetch here,
    // since each fetch makes an HTTP request.
    OpenDisclosure.Data = {
      employerContributions: new OpenDisclosure.EmployerContributions(),
      categoryContributions: new OpenDisclosure.CategoryContributions(),
      whales: new OpenDisclosure.Whales(),
      multiples: new OpenDisclosure.Multiples(),
      zipContributions: $.getJSON("/api/contributions/zip"),
      dailyContributions: $.getJSON("/api/contributions/over_time")
    };

    // Call fetch on each Backbone.Collection
    for (var dataset in OpenDisclosure.Data) {
      if (typeof OpenDisclosure.Data[dataset].fetch === "function") {
        OpenDisclosure.Data[dataset].fetch();
      }
    }

    OpenDisclosure.Data.candidates = new OpenDisclosure.Candidates(OpenDisclosure.BootstrappedData.candidates);

    Backbone.history.start({ pushState: true });
  },

  home: function(){
    $(window).scrollTop(0);
    new OpenDisclosure.Views.Home({
      el: '.main'
    });
  },

  about: function () {
    $(window).scrollTop(0);
    new OpenDisclosure.Views.About({
      el: '.main'
    });
  },

  candidate: function(name){
    $(window).scrollTop(0);
    new OpenDisclosure.Views.Candidate({
      el: '.main',
      candidateName: name
    });
  },

  rules: function () {
    $(window).scrollTop(0);
    new OpenDisclosure.Views.Rules({
      el: '.main'
    });
  },

  contributor : function(id) {
    $(window).scrollTop(0);
    new OpenDisclosure.Views.Contributor({
      el: '.main',
      contributorId: id
    });
  },

  employer : function(employer_name, employer_id) {
    $(window).scrollTop(0);
    new OpenDisclosure.Views.Employees({
      el: '.main',
      employer_id: employer_id,
      headline: employer_name
    });
  },

  search : function(name) {
    $(window).scrollTop(0);
    new OpenDisclosure.Views.Contributor({
      el: '.main',
      search: name
    });
  },

  searchCommittee: function(name){
    $(window).scrollTop(0);
    new OpenDisclosure.Views.Committee({
      el: '.main',
      committeeName: name
    });
  },

  faq : function() {
    $(window).scrollTop(0);
    new OpenDisclosure.Views.Faq({
      el: '.main'
    });
    // For some reason the FAQ page does not go to the hash.
    // This code makes it do it.
    var tmp = location.hash;
    location.hash = "";
    location.hash = tmp;
  },

  handleLinkClicked: function(e) {
    var $link = $(e.target).closest('a');

    if ($link.length) {
      var linkUrl = $link.attr('href'),
          externalUrl = linkUrl.indexOf('http') === 0,
          dontIntercept = e.altKey || e.ctrlKey || e.metaKey || e.shiftKey;

      if (externalUrl || dontIntercept) {
        return;
      } else {
        e.preventDefault();
      }

      this.navigate(linkUrl.replace(/^\//,''), { trigger: true });
    }
  }
});

$(function() {
  var app = new OpenDisclosure.App();
  window.appNavigate = app.navigate;
  $(document).click(app.handleLinkClicked.bind(app));
});
