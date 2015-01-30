OpenDisclosure.PaymentsView = Backbone.View.extend({
  template: _.template('\
    <div class="col-sm-12">\
      <h2><%= headline %></h2>\
    </div>\
    <div class="payments clearfix">\
      <div class="leftPayments col-sm-6"><%= leftPayments %></div>\
      <div class="rightPayments col-sm-6"><%= rightPayments %></div>\
    </div>'),

  paymentTemplate: _.template('\
      <div class="col-xs-12 payment">\
          <span class="col-xs-6"><%= payment.attributes.recipient.name %></span>\
          <span class="col-xs-2"><%= OpenDisclosure.friendlyMoney(payment.attributes.amount) %></span>\
          <span class="col-xs-4"><%= payment.attributes.date ? moment(payment.attributes.date).format("MMM-DD-YY"): "" %></span>\
      </div>'),

  initialize: function(options) {
    this.headline = options.headline;
    this.showDate = options.showDate;

    _.bindAll(this, 'renderPayment');

    this.render();
  },

  render: function() {
    var half  = Math.round(this.collection.length/2);
    var left  = this.collection.slice(0,half);
    var right = this.collection.slice(half);

    this.$el.html(this.template({
      headline : this.headline,
      leftPayments : left.map(this.renderPayment).join(''),
      rightPayments : right.map(this.renderPayment).join('')
    }));
  },

  renderPayment: function(payment) {
    var payment = new OpenDisclosure.Payment(payment.attributes);
    var renderedPayments = '';
    renderedPayments = this.paymentTemplate({
      payment: payment
    })

    return renderedPayments;
  }
});
