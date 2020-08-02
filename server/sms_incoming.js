const dbh = require('./db_handler').dbh;
const utils = require('./utils');

function smsIncoming(payload) {
  let messageId = utils.randHex(8);
  return dbh.pool.query({
    sql: ('INSERT INTO `messages`(`id`, `call_sid`, `status`, `from`, `to`, `text`) '
      + 'VALUES (?, ?, ?, ?, ?)'),
    values: [messageId, payload.MessageSid, 'received', payload.From, payload.To,
      req.body.Body]
  });
}

module.exports = smsIncoming;
