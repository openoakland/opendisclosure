OpenDisclosure.Candidate = Backbone.Model.extend({
  linkPath : function() {
    return '/candidate/' + this.attributes.short_name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  },

  imagePath : function() {
    return this.attributes.image;
  },

  totalContributions : function() {
    return OpenDisclosure.friendlyMoney(this._totalContributionsRaw());
  },

  availableBalance : function() {
    return OpenDisclosure.friendlyMoney(this.attributes.summary['ending_cash_balance'] -
                                        this.attributes.summary['total_unpaid_bills']);
  },

  pctContributionsFromOakland : function() {
    return OpenDisclosure.friendlyPct(
      (this.attributes.received_contributions_from_oakland - this.attributes.self_contributions_total)/ (this._totalContributionsRaw() -
      (this.attributes.self_contributions_total + this.attributes.summary['total_unitemized_contributions']))
    );
  },

  pctSmallContributions : function() {
    return OpenDisclosure.friendlyPct(
      (this.attributes.summary['total_unitemized_contributions'] +
       this.attributes.small_contributions) / this._totalContributionsRaw());
  },

  pctPersonalContributions: function(){
    return OpenDisclosure.friendlyPct(this.get('self_contributions_total') / this.get('summary').total_contributions_received);
  },

  avgContribution : function () {
    return OpenDisclosure.friendlyMoney(this._totalContributionsRaw() / this.attributes.received_contributions_count);
  },

  friendlySummaryNumber : function(which) {
    return OpenDisclosure.friendlyMoney(this.attributes.summary[which]);
  },

  _totalContributionsRaw : function() {
    return this.attributes.summary['total_contributions_received'] + this.attributes.summary['total_misc_increases_to_cash'];
  },
});
