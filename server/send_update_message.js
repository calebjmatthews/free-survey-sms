const client =
  require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const dbh = require('./db/db_handler').dbh;

function sendAndUpdateMessage(toPhone, text, messageId) {
  let twiMsg = { to: toPhone, from: process.env.TWILIO_PHONE_NUMBER, body: text, };
  return client.messages.create(twiMsg)
  .then((message) => {
    return dbh.pool.query({
      sql: ('UPDATE `messages` SET `call_sid`=? WHERE `id`=?'),
      values: [message.sid, messageId]
    });
  })
  .catch((err) => {
    console.error(err);
  });
}

module.exports = sendAndUpdateMessage;
