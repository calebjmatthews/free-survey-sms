const dbh = require('./db_handler').dbh;

function getMessageResults(surveyId) {
  let survey = null;
  let surveyContacts = null;
  let contacts = null;
  let messages = null;
  let responses = null;
  return Promise.all([
    dbh.pool.query({
      sql: ('SELECT * FROM `surveys` WHERE `id`=?'),
      values: [surveyId]
    }),
    dbh.pool.query({
      sql: ('SELECT * FROM `survey_contacts` WHERE `survey_id`=?'),
      values: [surveyId]
    }),
    dbh.pool.query({
      sql: ('SELECT * FROM `messages` WHERE `survey_id`=?'),
      values: [surveyId]
    }),
    dbh.pool.query({
      sql: ('SELECT * FROM `responses` WHERE `survey_id`=?'),
      values: [surveyId]
    })
  ])
  .then((results) => {
    survey = results[0][0];
    surveyContacts = results[1];
    messages = results[2];
    responses = results[3];
    let sqlString = 'SELECT * FROM `contacts` WHERE ';
    surveyContacts.map(() => { sqlString += '`id`=? OR '; });
    sqlString = sqlString.slice(0, -4);
    return dbh.pool.query({
      sql: sqlString,
      values: surveyContacts.map((sc) => { return sc.contact_id; })
    });
  })
  .then((contactsRes) => {
    contacts = contactsRes;
    return {
      survey: survey,
      contacts: contacts,
      messages: messages,
      responses: responses
    };
  });
}

module.exports = getMessageResults;
