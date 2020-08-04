const client =
  require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const dbh = require('./db_handler').dbh;
  
const FROM_PHONE_NUMBER = '+16692382810';

function sendAndUpdateMessage(toPhone, text, messageId) {
  let twiMsg = { to: toPhone, from: FROM_PHONE_NUMBER, body: text, };
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
