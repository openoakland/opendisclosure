Handlebars.registerHelper('friendlyMoney', function(amount) {
  return accounting.formatMoney(amount, '$', 0);
});
