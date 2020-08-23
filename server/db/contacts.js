const dbh = require('./db_handler').dbh;

function insertContacts(contacts, accountId) {
  let insPromises = [];
  Object.keys(contacts.contacts).map((id) => {
    let contact = contacts.contacts[id];
    insPromises.push(dbh.pool.query({
      sql: ('INSERT INTO `contacts`(`id`, `account_id`, `phone`, `name`, '
        + '`selected_last`) VALUES (?, ?, ?, ?, ?)'),
      values: [contact.id, accountId, contact.phone, contact.name]
    }));
  });
  return Promise.all(insPromises);
}

function handleContacts(contacts, accountId) {
  let insPromises = [];
  let updPromises = [];
  let delPromises = [];

  Object.keys(contacts.contacts).map((id) => {
    let contact = contacts.contacts[id];
    switch(contact.status) {
      case 'new':
      insPromises.push(dbh.pool.query({
        sql: ('INSERT INTO `contacts`(`id`, `account_id`, `phone`, `name`, '
          + '`selected_last`) VALUES (?, ?, ?, ?, ?)'),
        values: [contact.id, accountId, contact.phone, contact.name, contact.selected]
      }));
      break;

      case 'updated':
      updPromises.push(dbh.pool.query({
        sql: ('UPDATE `contacts` SET `phone`=?, `name`=?, `updated_at`=?, '
          + '`selected_last`=? WHERE `id`=?'),
        values: [contact.phone, contact.name, new Date(Date.now()),
          contact.selected, contact.id]
      }));
      break;
    }
  });

  Object.keys(contacts.deletedContacts).map((id) => {
    let contact = contacts.deletedContacts[id];
    delPromises.push(dbh.pool.query({
      sql: ('DELETE FROM `contacts` WHERE `id`=?'),
      values: [contact.id]
    }));
  });

  return Promise.all([Promise.all(insPromises), Promise.all(updPromises),
    Promise.all(delPromises)]);
}

module.exports = { handleContacts, insertContacts }
