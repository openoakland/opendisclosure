OpenDisclosure.Contribution = Backbone.Model.extend({
  linkPath : function() {
    return '/contributor/' + this.attributes.contributor.id;
  }
});

OpenDisclosure.EmployerContribution = Backbone.Model.extend({
});

OpenDisclosure.CategoryContribution = Backbone.Model.extend({
});

OpenDisclosure.Whale = Backbone.Model.extend({
});

OpenDisclosure.Multiple = Backbone.Model.extend({
});

OpenDisclosure.Contributor = Backbone.Model.extend({
});
