const dbh = require('./db_handler').dbh;
const utils = require('./utils');

function smsIncoming(payload) {
  let messageId = utils.randHex(8);
  return dbh.pool.query({
    sql: ('INSERT INTO `messages`(`id`, `call_sid`, `status`, `from`, `to`, `text`) '
      + 'VALUES (?, ?, ?, ?, ?)'),
    values: [messageId, payload.MessageSid, 'received', payload.From, payload.To,
      req.body.Body]
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
    return dbh.pool.query({
      sql: ('UPDATE `messages` SET `account_id`=?, `survey_id`=?, `contact_id`=? '
        + 'WHERE `messages`.`id`=?'),
      values: [surveyContact.account_id, surveyContact.survey_id,
        surveyContact.contact_id, messageId]
    })
  });
}

module.exports = smsIncoming;
