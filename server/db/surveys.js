const dbh = require('./db_handler').dbh;

function insertSurvey(build, accountId, surveyId) {
  return dbh.pool.query({
    sql: ('INSERT INTO `surveys`(`id`, `account_id`, `active`, '
      + '`opener`, `response`, `show_link`) VALUES (?, ?, ?, ?, ?, ?)'),
    values: [surveyId, accountId, 1, build.opener, build.response,
      (build.showLink ? 1 : 0)]
  });
}

module.exports = { insertSurvey }
