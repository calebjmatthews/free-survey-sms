const dbh = require('./db_handler').dbh;
const utils = require('../utils');
const sendAndUpdateMessage = require('../send_update_message');

function insertAndSendMessages(build, contacts, accountId) {
  let text = (build.opener + ' ');
  Object.keys(build.options).map((letter) => {
    let option = build.options[letter];
    text += (option.letter + ') ' + option.text + ' ');
  });
  let insPromises = [];
  let messageIds = {};
  Object.keys(contacts).map((id) => {
    let contact = contacts[id];
    let messageId = utils.randHex(8);
    messageIds[id] = messageId;
    insPromises.push(dbh.pool.query({
      sql: ('INSERT INTO `messages`(`id`, `account_id`, `survey_id`, '
        + '`contact_id`, `status`, `from`, `to`, `direction`, `text`) '
        + 'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'),
      values: [messageId, accountId, build.surveyId, contact.id, 'initiated',
        process.env.TWILIO_PHONE_NUMBER, contact.phone, 'outgoing', text]
    }));
  });
  return Promise.all(insPromises)
  .then((res) => {
    let contactIds = Object.keys(contacts);
    return callSendAndUpdateMessages(contactIds, contacts, text, messageIds);
  });
}

function callSendAndUpdateMessages(contactIds, contacts, text, messageIds) {
  if (contactIds.length > 0) {
    let contact = contacts[contactIds[0]];
    return sendAndUpdateMessage(contact.phone, text, messageIds[contactIds[0]])
    .then(() => {
      return callSendAndUpdateMessages(contactIds.slice(1), contacts, text, messageIds)
    });
  }
  else {
    return true;
  }
}

module.exports = { insertAndSendMessages }
