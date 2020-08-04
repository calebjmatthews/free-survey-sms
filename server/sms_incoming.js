const dbh = require('./db_handler').dbh;
const utils = require('./utils');

const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
  'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

function smsIncoming(payload) {
  let surveyContact = null;
  let survey = null;
  let surveyOptions = null;

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
    surveyContact = surveyContactRes[0];
    if (surveyContact) {
      return Promise.all([
        dbh.pool.query({
          sql: ('SELECT * FROM `surveys` WHERE `id`=?'),
          values: [surveyContact.survey_id]
        }),
        dbh.pool.query({
          sql: ('SELECT * FROM `survey_options` WHERE `survey_id`=?'),
          values: [surveyContact.survey_id]
        }),
        dbh.pool.query({
          sql: ('UPDATE `messages` SET `account_id`=?, `survey_id`=?, `contact_id`=? '
            + 'WHERE `messages`.`id`=?'),
          values: [surveyContact.account_id, surveyContact.survey_id,
            surveyContact.contact_id, messageId]
        })
      ]);
    }
    else {
      return unknownNumberRespond();
    }
  })

  .then((surveyFetchRes) => {
    if (surveyFetchRes != null) {
      survey = surveyFetchRes[0][0];
      surveyOptions = surveyFetchRes[1];
      let letterRes = parseIncomingText(payload.Body, surveyOptions);
      if (letterRes.message == 'Valid') {
        let responseId = utils.randHex(8);
        return dbh.pool.query({
          sql: ('INSERT INTO `responses`(`id`, `account_id`, `survey_id`, `letter`) '
            + 'VALUES (?, ?, ?, ?)'),
          values: [responseId, surveyContact.account_id, surveyContact.survey_id,
            letterRes.value]
        });
      }
      else {
        return new Promise((resolve) => resolve(false));
      }
    }
  });
}

function parseIncomingText(rawText, surveyOptions) {
  let optionLetters = surveyOptions.map((option) => { return option.letter });
  let text = rawText.trim().toUpperCase();
  if (text.length == 1) {
    if (letters.includes(text)) {
      if (optionLetters.includes(text)) {
        return {message: 'Valid', value: text};
      }
      return {message: 'Not a survey option'};
    }
    return {message: 'Not a letter'};
  }
  return {message: 'More than one character'};
}

function unknownNumberRespond() {
  return new Promise((resolve) => resolve(null));
}

module.exports = smsIncoming;
