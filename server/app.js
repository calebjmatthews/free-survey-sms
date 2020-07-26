const express = require('express');
const app = express();
const server = require('http').Server(app);
const setRoutes = require('./routes');

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
