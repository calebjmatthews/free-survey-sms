const dbh = require('./db_handler').dbh;

function insertPaypalEvent(payload) {
  let resource = null;
  let links = null;
  let eventId = null;
  let amount = null;
  try {
    resource = JSON.stringify(payload.resource);
    links = JSON.stringify({ links: payload.links });
    eventId = payload.resource.id;
    amount = parseFloat(payload.resource.amount.value);
  }
  catch(err) { console.error(err); }
  return dbh.pool.query({
    sql: ('INSERT INTO `paypal_events`(`notification_id`, `create_time`, '
      + '`resource_type`, `event_type`, `summary`, `resource`, `links`, `event_id`, '
      + '`amount`) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)'),
    values: [payload.id, payload.create_time, payload.resource_type,
      payload.event_type, payload.summary, resource, links, eventId, amount]
  });
}

module.exports = { insertPaypalEvent }
