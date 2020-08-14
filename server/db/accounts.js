const bcrypt = require('bcrypt');

const dbh = require('./db_handler').dbh;
const utils = require('../utils');

function insertAccount(signup, accountId) {
  return dbh.pool.query({
    sql: ('INSERT INTO `accounts`(`id`, `phone`, `password`, '
      + '`last_free_credit`) VALUES (?, ?, ?, ?)'),
    values: [accountId, signup.phone,
      bcrypt.hashSync(signup.password, bcrypt.genSaltSync(8), null),
      utils.getDateString(new Date(Date.now()))]
  });
}

module.exports = { insertAccount }
