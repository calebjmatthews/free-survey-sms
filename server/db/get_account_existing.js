const dbh = require('./db_handler').dbh;
const getCurrentUsageBalance = require('./usages').getCurrentUsageBalance;

function getAccountExisting(accountId) {
  return Promise.all([
    dbh.pool.query({
      sql: ('SELECT * FROM `contacts` WHERE `account_id`=?'),
      values: [accountId]
    }),
    getCurrentUsageBalance(accountId)
  ])
  .then((results) => {
    return {
      contacts: results[0],
      balance: results[1]
    }
  });
}

module.exports = getAccountExisting;
