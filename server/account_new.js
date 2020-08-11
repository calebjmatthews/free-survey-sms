const bcrypt = require('bcrypt');
const dbh = require('./db_handler').dbh;
const sendAndUpdateMessage = require('./send_update_message');
const utils = require('./utils');

const FREE_MONTHLY_USAGE = 30;
const FROM_PHONE_NUMBER = '+16692382810';
const URL = 'textpoll.app/r/';

function accountNewHandle(payload) {
  return Promise.all([
    insertAccount(payload.signup, payload.signup.accountId),
    insertPositiveUsage(payload.signup.accountId),
    insertSurvey(payload.build, payload.signup.accountId, payload.build.surveyId),
    insertSurveyOptions(payload.build, payload.signup.accountId, payload.build.surveyId),
    insertSurveyContacts(payload.contacts, payload.signup.accountId,
      payload.build.surveyId),
    insertContacts(payload.contacts, payload.signup.accountId, payload.build.surveyId),
    checkUsageCoveredAndInsert(payload.build, payload.contacts, payload.signup.accountId)
  ]);
}

function insertAccount(signup, accountId) {
  return dbh.pool.query({
    sql: ('INSERT INTO `accounts`(`id`, `phone`, `password`, '
      + '`last_free_credit`) VALUES (?, ?, ?, ?)'),
    values: [accountId, signup.phone,
      bcrypt.hashSync(signup.password, bcrypt.genSaltSync(8), null),
      utils.getDateString(new Date(Date.now()))]
  });
}

function insertPositiveUsage(accountId) {
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
  let insPromises = [];
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
  let insPromises = [];
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

function insertAndSendMessages(build, contacts, accountId) {
  let text = (build.opener + ' ');
  Object.keys(build.options).map((letter) => {
    let option = build.options[letter];
    text += (option.letter + ') ' + option.text + ' ');
  });
  let insPromises = [];
  let messageIds = {};
  Object.keys(contacts.contacts).map((id) => {
    let contact = contacts.contacts[id];
    let messageId = utils.randHex(8);
    messageIds[id] = messageId;
    insPromises.push(dbh.pool.query({
      sql: ('INSERT INTO `messages`(`id`, `account_id`, `survey_id`, '
        + '`contact_id`, `status`, `from`, `to`, `direction`, `text`) '
        + 'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'),
      values: [messageId, accountId, build.surveyId, contact.id, 'initiated',
        FROM_PHONE_NUMBER, contact.phone, 'outgoing', text]
    }));
  });
  return Promise.all(insPromises)
  .then((res) => {
    let contactIds = Object.keys(contacts.contacts);
    return callSendAndUpdateMessages(contactIds, contacts.contacts, text, messageIds);
  });
}

function callSendAndUpdateMessages(contactIds, contacts, text, messageIds) {
  if (contactIds.length > 0) {
    let contact = contacts[contactIds[0]];
    return sendAndUpdateMessage(contact.phone, text, messageIds[contactIds[0]])
    .then(() => {
      return callSendAndUpdateMessages(contactIds.slice(1), contacts, text, messageIds)
    });
  }
  else {
    return true;
  }
}

function checkUsageCoveredAndInsert(build, contacts, accountId) {
  let questionCharCount = build.opener.length;
  Object.keys(build.options).map((letter) => {
    questionCharCount += build.options[letter].text.length;
  });
  let usage = ((Math.ceil(questionCharCount / 160)
    + Math.ceil(build.response.length / 160)) * Object.keys(contacts.contacts).length);

  if (usage <= FREE_MONTHLY_USAGE) {
    return Promise.all([
      insertNegativeUsage(accountId, usage),
      insertAndSendMessages(build, contacts)
    ]);
  }
  else {
    console.error('Calculated usage ' + usage + ' higher than free monthly credits');
    return false;
  }
}

function insertNegativeUsage(accountId, usage) {
  let usageId = utils.randHex(8);
  return dbh.pool.query({
    sql: ('INSERT INTO `usages`(`id`, `account_id`, `message_count`, '
      + '`direction`) VALUES (?, ?, ?, ?)'),
    values: [usageId, accountId, usage, 'negative']
  });
}

module.exports = accountNewHandle
