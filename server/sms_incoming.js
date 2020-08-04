const dbh = require('./db_handler').dbh;
const utils = require('./utils');

const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
  'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

function smsIncoming(payload) {
  let messageId = utils.randHex(8);
  return dbh.pool.query({
    sql: ('INSERT INTO `messages`(`id`, `call_sid`, `status`, `from`, `to`, `text`) '
      + 'VALUES (?, ?, ?, ?, ?, ?)'),
    values: [messageId, payload.MessageSid, 'received', payload.From, payload.To,
      payload.Body]
  })
  .then(() => {
    return dbh.pool.query({
      sql: ('SELECT `survey_contacts`.`account_id`, `survey_contacts`.`survey_id`, '
        + '`survey_contacts`.`contact_id` '
        + 'FROM `survey_contacts` LEFT JOIN `contacts` '
        + 'ON `survey_contacts`.`contact_id`=`contacts`.`id` '
        + 'WHERE `survey_contacts`.`active`=1 AND `contacts`.`phone`=?;'),
      values: [payload.From]
    })
  })
  .then((surveyContactRes) => {
    let surveyContact = surveyContactRes[0];
    if (surveyContact) {
      let promises = [];
      let letter = parseIncomingText(payload.Body);
      if (letter) {
        let responseId = utils.randHex(8);
        promises.push(dbh.pool.query({
          sql: ('INSERT INTO `responses`(`id`, `account_id`, `survey_id`, `letter`) '
            + 'VALUES (?, ?, ?, ?)'),
          values: [responseId, surveyContact.account_id, surveyContact.survey_id, letter]
        }))
      }
      else {
        promises.push(new Promise((resolve) => resolve(false)));
      }
      promises.push(dbh.pool.query({
        sql: ('UPDATE `messages` SET `account_id`=?, `survey_id`=?, `contact_id`=? '
          + 'WHERE `messages`.`id`=?'),
        values: [surveyContact.account_id, surveyContact.survey_id,
          surveyContact.contact_id, messageId]
      }));
      return promises;
    }
  });
}

function parseIncomingText(rawText) {
  let text = rawText.trim().toUpperCase();
  if (text.length == 1) {
    if (letters.includes(text)) {
      return text;
    }
  }
  return null;
}

module.exports = smsIncoming;
