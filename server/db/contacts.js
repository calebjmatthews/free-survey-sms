const dbh = require('./db_handler').dbh;

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

module.exports = { insertContacts }
