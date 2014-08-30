OpenDisclosure.App = Backbone.Router.extend({
  routes: {
    '': 'home',
    'about': 'about',
    'candidate/:id': 'candidate',
    'faq':'faq',
    'rules': 'rules',
    'contributor/:id': 'contributor',
    'employer/:employer_name/:employer_id/:recipient_id': 'employer',
    'search': 'search'
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
      multiples: new OpenDisclosure.Multiples()
    };

    // Every item in OpenDisclosure.Data is a Backbone.Collection, so they all
    // have a fetch method.
    for (var dataset in OpenDisclosure.Data) {
      OpenDisclosure.Data[dataset].fetch();
    }

    OpenDisclosure.Data.candidates = new OpenDisclosure.Candidates(OpenDisclosure.BootstrappedData.candidates);

    Backbone.history.start({ pushState: true });
  },

  home: function(){
    new OpenDisclosure.Views.Home({
      el: '.main'
    });
  },

  about: function () {
    new OpenDisclosure.Views.About({
      el: '.main'
    });
  },

  candidate: function(name){
    new OpenDisclosure.Views.Candidate({
      el: '.main',
      candidateName: name
    });
  },

  rules: function () {
    new OpenDisclosure.Views.Rules({
      el: '.main'
    });
  },

  contributor : function(id) {
    new OpenDisclosure.Views.Contributor({
      el: '.main',
      contributorId: id
    });
  },

  employer : function(employer_name, employer_id, recipient_id) {
    $('.main').html('<div id="employer"></div>');
    var contrib = new OpenDisclosure.Employees({employer_id: employer_id, recipient_id: recipient_id } );

    this.listenTo(contrib, 'sync', function() {
      new OpenDisclosure.ContributorsView({
        el: '#employer',
        collection: contrib,
        headline: employer_name
      });
    });
  },

  search : function() {
    new OpenDisclosure.Views.Contributor({
      el: '.main',
      search: location.search.slice(location.search.search("name=") + 5)
    });
  },

  faq : function() {
    new OpenDisclosure.Views.Faq({
      el: '.main',
    });
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
  $(document).click(app.handleLinkClicked.bind(app));
});
