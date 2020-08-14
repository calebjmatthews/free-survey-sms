const dbh = require('./db_handler').dbh;
const utils = require('../utils');

function insertSurveyOptions(build, accountId, surveyId) {
  let insPromises = []
  Object.keys(build.options).map((letter) => {
    let option = build.options[letter];
    let optionId = utils.randHex(8);
    insPromises.push(dbh.pool.query({
      sql: ('INSERT INTO `survey_options`(`id`, `account_id`, `survey_id`, `letter`, '
        + '`text`) VALUES (?, ?, ?, ?, ?)'),
      values: [optionId, accountId, surveyId, option.letter, option.text]
    }));
  });
  return Promise.all(insPromises);
}

module.exports = { insertSurveyOptions }
