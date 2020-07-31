const bcrypt = require('bcrypt');
const dbh = require('./db_handler').dbh;
const utils = require('./utils');

const FREE_MONTHLY_USAGE = 30;

function accountNewHandle(payload) {
  console.log('payload');
  console.log(payload);
  let accountId = utils.randHex(8);
  let surveyId = utils.randHex(8);
  return Promise.all([
    insertAccount(payload.signup, accountId),
    insertUsage(accountId),
    insertSurvey(payload.build, accountId, surveyId),
    insertSurveyOptions(payload.build, accountId, surveyId),
    insertSurveyContacts(payload.contacts, accountId, surveyId),
    insertContacts(payload.contacts, accountId, surveyId)
  ]);
}

function insertAccount(signup, accountId) {
  return dbh.pool.query({
    sql: ('INSERT INTO `accounts`(`id`, `email`, `password`, '
      + '`last_free_credit`) VALUES (?, ?, ?, ?)'),
    values: [accountId, signup.email,
      bcrypt.hashSync(signup.password, bcrypt.genSaltSync(8), null),
      utils.getDateString(new Date(Date.now()))]
  });
}

function insertUsage(accountId) {
  let usageId = utils.randHex(8);
  return dbh.pool.query({
    sql: ('INSERT INTO `usages`(`id`, `account_id`, `message_count`, '
      + '`direction`) VALUES (?, ?, ?, ?)'),
    values: [usageId, accountId, FREE_MONTHLY_USAGE, 'positive']
  });
}

function insertSurvey(build, accountId, surveyId) {
  return dbh.pool.query({
    sql: ('INSERT INTO `surveys`(`id`, `account_id`, `active`, '
      + '`opener`, `response`, `show_link`) VALUES (?, ?, ?, ?, ?, ?)'),
    values: [surveyId, accountId, 1, build.opener, build.response,
      (build.showLink ? 1 : 0)]
  });
}

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

function insertSurveyContacts(contacts, accountId, surveyId) {
  let insPromises = []
  Object.keys(contacts.contacts).map((id) => {
    let contact = contacts.contacts[id];
    let surveyContactId = utils.randHex(8);
    insPromises.push(dbh.pool.query({
      sql: ('INSERT INTO `survey_contacts`(`id`, `account_id`, `survey_id`, `active`, '
        + '`contact_id`) VALUES (?, ?, ?, ?, ?)'),
      values: [surveyContactId, accountId, surveyId, 1, contact.id]
    }));
  });
  return Promise.all(insPromises);
}

function insertContacts(contacts, accountId, surveyId) {
  let insPromises = []
  Object.keys(contacts.contacts).map((id) => {
    let contact = contacts.contacts[id];
    insPromises.push(dbh.pool.query({
      sql: ('INSERT INTO `contacts`(`id`, `account_id`, `phone`, `name`) '
        + 'VALUES (?, ?, ?, ?)'),
      values: [contact.id, accountId, contact.phone, contact.name]
    }));
  });
  return Promise.all(insPromises);
}

module.exports = accountNewHandle
