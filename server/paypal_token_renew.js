const dbh = require('./db/db_handler').dbh;
const axios = require('axios');

function paypalTokenRenew() {
  return axios({
    method: 'POST',
    url: 'https://api.sandbox.paypal.com/v1/oauth2/token',
    auth: {
      username: process.env.PAYPAL_CLIENT_ID,
      password: process.env.PAYPAL_SECRET
    },
    data: 'grant_type=client_credentials'
  })
  .then((res) => {
    let insPromise = new Promise((resolve) => resolve(null));
    try {
      insPromise = dbh.pool.query({
        sql: 'UPDATE `paypal_token` SET `token`=?',
        values: res.data.access_token
      })
      .then(() => { return res.data.access_token; } );
    }
    catch(err) { console.error(err); }
    return insPromise;
  })
  .catch((err) => { console.error(err); })
}

module.exports = paypalTokenRenew;
