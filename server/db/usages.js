const dbh = require('./db_handler').dbh;
const insertAndSendMessages = require('./messages').insertAndSendMessages;
const utils = require('../utils');

function insertPositiveUsage(accountId, usage) {
  let usageId = utils.randHex(8);
  return dbh.pool.query({
    sql: ('INSERT INTO `usages`(`id`, `account_id`, `message_count`, '
      + '`direction`) VALUES (?, ?, ?, ?)'),
    values: [usageId, accountId, usage, 'positive']
  });
}

function insertNegativeUsage(accountId, usage) {
  let usageId = utils.randHex(8);
  return dbh.pool.query({
    sql: ('INSERT INTO `usages`(`id`, `account_id`, `message_count`, '
      + '`direction`) VALUES (?, ?, ?, ?)'),
    values: [usageId, accountId, usage, 'negative']
  });
}

function checkUsageCoveredAndInsert(build, contacts, accountId, currentBalance) {
  let questionCharCount = build.opener.length;
  Object.keys(build.options).map((letter) => {
    questionCharCount += build.options[letter].text.length;
  });
  let usage = ((Math.ceil(questionCharCount / 160)
    + Math.ceil(build.response.length / 160)) * Object.keys(contacts.contacts).length);

  if (usage <= currentBalance) {
    return Promise.all([
      insertNegativeUsage(accountId, usage),
      insertAndSendMessages(build, contacts)
    ]);
  }
  else {
    console.error('Calculated usage ' + usage + ' higher than free monthly credits');
    return false;
  }
}

module.exports = { insertPositiveUsage, insertNegativeUsage, checkUsageCoveredAndInsert }
