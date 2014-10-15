var OpenDisclosure = window.OpenDisclosure || {};

OpenDisclosure.friendlyMoney = function(number) {
return accounting.formatMoney(number, '$', 0);
};

OpenDisclosure.friendlyPct = function(float) {
  var result = Math.round(float * 10000) / 100;
  result = result || 0; //Turns NaN into 0 for display purposes
  result +=  "%";
  return result;
};
