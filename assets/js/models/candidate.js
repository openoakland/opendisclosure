OpenDisclosure.Candidate = Backbone.Model.extend({
  imagePath : function() {
    return this.attributes.image;
  },

  pctContributionsFromOakland : function() {
    return OpenDisclosure.friendlyPct(1 - this.attributes.received_contributions_from_oakland /
                            this.attributes.received_contributions_count);
  },

  pctSmallContributions : function() {
    return OpenDisclosure.friendlyPct((
      this.attributes.small_donations +
         this.attributes.summary['total_unitemized_contributions']) /
      this.attributes.summary['total_contributions_received']);
  },

  avgContribution : function () {
    return OpenDisclosure.friendlyMoney(
      this.attributes.summary['total_contributions_received']/
      this.attributes.received_contributions_count);
  },

  friendlySummaryNumber : function(which) {
    return OpenDisclosure.friendlyMoney(this.attributes.summary[which]);
  },
});
