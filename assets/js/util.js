var OpenDisclosure = window.OpenDisclosure || {};

OpenDisclosure.friendlyMoney = function(number) {
return accounting.formatMoney(number, '$', 0);
}

OpenDisclosure.friendlyPct = function(float) {
return Math.round(float * 10000) / 100 + "%";
}
