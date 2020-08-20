const express = require('express');
const app = express();
const server = require('http').Server(app);
require('dotenv-safe').config();
const configurePassport = require('./passport').configurePassport;
const setRoutes = require('./routes');
const paypalTokenRenew = require('./paypal_token_renew');

configurePassport();
setRoutes(app);

if (module === require.main) {
  // [START server]
  server.listen(process.env.PORT || 8080, () => {
    const port = server.address().port;
    console.log(`App listening on port ${port}`);
  });
  // [END server]
}

module.exports = app;
