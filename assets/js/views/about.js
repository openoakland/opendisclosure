OpenDisclosure.Views.About = Backbone.View.extend({
  team: [
    {
      "name" : "Lauren Angius",
      "github" : "https://github.com/lla2105"
    },
    {
      "name" : "Tom Dooner",
      "github" : "https://github.com/tdooner"
    },
    {
      "name" : "Mike Ubell",
      "github" : "https://github.com/mikeubell"
    },
    {
      "name" : "Elina Rubuliak",
      "github" : "https://github.com/elinaru"
    },
    {
      "name" : "Kyle Warneck",
      "github" : "https://github.com/KyleW"
    },
    {
      "name" : "Vivian Brown",
      "github" : "https://github.com/vbrown608"
    },
    {
      "name" : "Ian Root",
      "github" : "https://github.com/ianaroot"
    },
    {
      "name" : "Klein Lieu",
      "github" : "https://github.com/kleinlieu"
    },
    {
      "name" : "Amanda Richardson",
      "github" : "https://github.com/amandaric"
    },
    {
      "name" : "Dave Guarino",
      "github" : "https://github.com/daguar"
    },
    {
      "name" : "John Osborn",
      "github" : "https://github.com/bayreporta"
    },
    {
      "name" : "Phil Wolff",
      "github" : "https://github.com/evanwolf"
    },
    {
      "name" : "Steve 'Spike' Spiker",
      "github" : "https://github.com/spjika"
    },
    {
      "name" : "Luis Aguilar",
      "github" : "https://github.com/munners17"
    },
    {
      "name" : "Emily Bookstein",
      "github" : "https://github.com/bookstein"
    },
    {
      "name" : "Brian Ferrell",
      "github" : "https://github.com/endenizen"
    },
    {
      "name" : "Edward Breen",
      "github" : "https://github.com/tedbreen"
    },
    {
      "name" : "Timothy Kempf",
      "github" : "https://github.com/Fauntleroy"
    },
    {
      "name" : "Ian Rees",
      "github" : "https://github.com/irees"
    },
    {
      "name" : "Jonathan Wrobel",
      "github" : "https://github.com/jwrobes"
    },
    {
      "name" : "Maggie Shine",
      "github" : "https://github.com/magshi"
    },
    {
      "name" : "Sunny Juneja",
      "github" : "https://github.com/whatasunnyday"
    }
  ],

  template: HandlebarsTemplates['about'],

  initialize: function() {
    this.render();
  },

  render: function() {
    this.$el.html(this.template({team: this.team}));
  },

});
