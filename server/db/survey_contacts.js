const dbh = require('./db_handler').dbh;
const utils = require('../utils');

function insertSurveyContacts(contacts, accountId, surveyId) {
  let insPromises = [];
  let selectedContacts = []
  Object.keys(contacts.contacts).map((id) => {
    let contact = contacts.contacts[id];
    if (contact.selected) {
      selectedContacts.push(contact);
    }
  });
  selectedContacts.map((contact) => {
    let surveyContactId = utils.randHex(8);
    insPromises.push(dbh.pool.query({
      sql: ('INSERT INTO `survey_contacts`(`id`, `account_id`, `survey_id`, `active`, '
        + '`contact_id`) VALUES (?, ?, ?, ?, ?)'),
      values: [surveyContactId, accountId, surveyId, 1, contact.id]
    }));
  });
  return Promise.all(insPromises);
}

module.exports = { insertSurveyContacts }
