const dbh = require('./db/db_handler').dbh;
const insertAccount = require('./db/accounts').insertAccount;
const insertPositiveUsage = require('./db/usages').insertPositiveUsage;
const checkUsageCoveredAndInsert = require('./db/usages').checkUsageCoveredAndInsert;
const insertSurvey = require('./db/surveys').insertSurvey;
const insertSurveyOptions = require('./db/survey_options').insertSurveyOptions;
const insertSurveyContacts = require('./db/survey_contacts').insertSurveyContacts;
const insertContacts = require('./db/contacts').insertContacts;

const FREE_MONTHLY_USAGE = 30;

function accountNewSubmission(payload) {
  return Promise.all([
    insertAccount(payload.signup, payload.signup.accountId),
    insertPositiveUsage(payload.signup.accountId, FREE_MONTHLY_USAGE),
    insertSurvey(payload.build, payload.signup.accountId, payload.build.surveyId),
    insertSurveyOptions(payload.build, payload.signup.accountId, payload.build.surveyId),
    insertSurveyContacts(payload.contacts, payload.signup.accountId,
      payload.build.surveyId),
    insertContacts(payload.contacts, payload.signup.accountId),
    checkUsageCoveredAndInsert(payload.build, payload.contacts, payload.signup.accountId,
      FREE_MONTHLY_USAGE)
  ]);
}

module.exports = accountNewSubmission
