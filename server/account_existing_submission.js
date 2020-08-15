const dbh = require('./db/db_handler').dbh;
const getCurrentUsageBalance = require('./db/usages').getCurrentUsageBalance;
const checkUsageCoveredAndInsert = require('./db/usages').checkUsageCoveredAndInsert;
const insertSurvey = require('./db/surveys').insertSurvey;
const insertSurveyOptions = require('./db/survey_options').insertSurveyOptions;
const insertSurveyContacts = require('./db/survey_contacts').insertSurveyContacts;
const handleContacts = require('./db/contacts').handleContacts;

function accountExistingSubmission(payload) {
  return getCurrentUsageBalance(payload.signup.accountId)
  .then((currentBalance) => {
    return Promise.all([
      insertSurvey(payload.build, payload.signup.accountId, payload.build.surveyId),
      insertSurveyOptions(payload.build, payload.signup.accountId, payload.build.surveyId),
      insertSurveyContacts(payload.contacts, payload.signup.accountId,
        payload.build.surveyId),
      handleContacts(payload.contacts, payload.signup.accountId, payload.build.surveyId),
      checkUsageCoveredAndInsert(payload.build, payload.contacts,
        payload.signup.accountId, currentBalance)
    ]);
  })
}

module.exports = accountExistingSubmission;
