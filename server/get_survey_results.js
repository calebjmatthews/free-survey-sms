const dbh = require('./db_handler').dbh;

function getSurveyResults(surveyId) {
  return Promise.all([
    dbh.pool.query({
      sql: ('SELECT * FROM `surveys` WHERE `id`=?'),
      values: [surveyId]
    }),
    dbh.pool.query({
      sql: ('SELECT * FROM `survey_options` WHERE `survey_id`=? '
        + 'ORDER BY `letter` ASC'),
      values: [surveyId]
    }),
    dbh.pool.query({
      sql: ('SELECT * FROM `responses` WHERE `survey_id`=?'),
      values: [surveyId]
    })
  ])
  .then((results) => {
    return {
      survey: results[0][0],
      surveyOptions: results[1],
      responses: results[2]
    }
  });
}

module.exports = getSurveyResults;
