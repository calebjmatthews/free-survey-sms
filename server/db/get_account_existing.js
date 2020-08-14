const dbh = require('./db_handler').dbh;

function getAccountExisting(accountId) {
  return Promise.all([
    dbh.pool.query({
      sql: ('SELECT * FROM `contacts` WHERE `account_id`=?'),
      values: [accountId]
    }),
    dbh.pool.query({
      sql: ('SELECT * FROM `usages` WHERE `account_id`=?'),
      values: [accountId]
    })
  ])
  .then((results) => {
    return {
      contacts: results[0],
      usages: results[1]
    }
  });
}

module.exports = getAccountExisting;
