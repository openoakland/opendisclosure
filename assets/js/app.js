OpenDisclosure.App = Backbone.Router.extend({
  routes: {
    '': 'home',
    'about': 'about',
    'rules': 'rules',
    'candidate/:id': 'candidate',
    'contributor/:id': 'contributor'
  },

  initialize : function() {
    // Store all the data globally, as a convenience.
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
    $('.main').html('<div id="contirbutor"></div>');

    var contributors = new OpenDisclosure.Contributors([], {
      contributor: id
    });
    contributors.fetch();

    new OpenDisclosure.ContributorView({
      el: '#contirbutor',
      collection: contributors
    });
  }

});

$(function(){
  app = new OpenDisclosure.App();
  Backbone.history.start({ pushState: true });

  $(document).click(function(e) {
    var $link = $(e.target).closest('a');

    if ($link.length) {
      var linkUrl = $link.attr('href'),
          externalUrl = linkUrl.indexOf('http') === 0,
          dontIntercept = e.altKey || e.ctrlKey || e.metaKey || e.shiftKey;

      if (externalUrl || dontIntercept) {
        return;
      }

      app.navigate(linkUrl.replace(/^\//,''), { trigger: true });
      e.preventDefault();
    }
  });
});
