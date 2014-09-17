Handlebars.registerHelper('friendlyMoney', function(amount) {
  return accounting.formatMoney(amount, '$', 0);
});

Handlebars.registerHelper('list', function(items) {
  var out = "<ul>";

  for(var i=0, l=items.length; i<l; i++) {
    out = out + "<li><a href='" +items[i].github + "'>" + items[i].name + "</a></li>";
  }

  return out + "</ul>";
});

