OpenDisclosure.App = Backbone.Router.extend({
  routes: {
    '': 'home',
    'about': 'about',
    'rules': 'rules',
    'candidate/:id': 'candidate',
    'contributor/:id': 'contributor',
    'employer/:employer_name/:employer_id/:recipient_id': 'employer'
  },

  initialize : function() {
    // Store all the data globally, as a convenience.
    //
    // We should try to minimize the amount of data we need to fetch here,
    // since each fetch makes an HTTP request.
    OpenDisclosure.Data = {
      candidates: new OpenDisclosure.Candidates(),
      contributions: new OpenDisclosure.Contributions(),
      employerContributions: new OpenDisclosure.EmployerContributions(),
      categoryContributions: new OpenDisclosure.CategoryContributions(),
      whales: new OpenDisclosure.Whales(),
      multiples: new OpenDisclosure.Multiples()
    }

    // Every item in OpenDisclosure.Data is a Backbone.Collection, so they all
    // have a fetch method.
    for (var dataset in OpenDisclosure.Data) {
      OpenDisclosure.Data[dataset].fetch();
    }

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

  rules: function () {
    new OpenDisclosure.Views.Rules({
      el: '.main'
    });
  },

  candidate: function(name){
    new OpenDisclosure.Views.Candidate({
      el: '.main',
      candidateName: name
    });
  },

  contributor : function(id) {
    new OpenDisclosure.Views.Contributor({
      el: '.main',
      contributorId: id
    });
  },

  employer : function(employer_name, employer_id, recipient_id) {
    $('.main').empty();
    $('<div id = "employer"></div> \
    ').appendTo('.main');
    var contrib = new OpenDisclosure.Employees({employer_id: employer_id, recipient_id: recipient_id } );
    this.listenTo(contrib, 'sync', function() {
      new OpenDisclosure.ContributorsView({el: '#employer', collection: contrib.models, headline: employer_name});
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
