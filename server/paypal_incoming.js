const insertPaypalEvent = require('./db/paypal_event').insertPaypalEvent;

function paypalIncoming(payload) {
  console.log('payload');
  console.log(payload);
  return insertPaypalEvent(payload);
}

module.exports = paypalIncoming;
