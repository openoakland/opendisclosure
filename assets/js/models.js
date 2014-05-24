
OpenDisclosure.Candidate = Backbone.Model.extend({
  imagePath : function() {
    return '/images/' + this.attributes.short_name.split(' ').slice(-1) + '.png';
  },

  pctContributionsFromOakland : function() {
    return this.friendlyPct(1 - this.attributes.received_contributions_from_oakland /
                            this.attributes.received_contributions_count);
  },

  friendlySummaryNumber : function(which) {
    return this.friendlyNumber(this.attributes.latest_summary[which]);
  },

  friendlyNumber : function(number) {
    return "$" + number;
  },

  friendlyPct : function(float) {
    return Math.round(float * 100) + "%";
  }
});


OpenDisclosure.Contribution = Backbone.Model.extend({

});
