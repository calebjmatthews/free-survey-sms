'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const accountNewHandle = require('./account_new');

module.exports = function(app) {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.use('/dist', (req, res) => {
    console.log(path.join(
      path.normalize(`${__dirname}/..`), ('dist' + req.url)
    ));
    res.sendFile(path.join(
      path.normalize(`${__dirname}/..`), ('dist' + req.url)
    ));
  })
  app.use(express.static(path.join(
    path.normalize(`${__dirname}/..`), 'dist'
  )));

  // Routes go here
  app.post('/account_new', (req, res) => {
    let payload = JSON.parse(req.body.payload);
    accountNewHandle(payload)
    .then((anhRes) => {
      res.status(200).send('Survey inserted');
    })
    .catch((err) => {
      console.error(err);
    })
  })

  app.all('/*', (req, res) => {
    console.log('Requested route not found:');
    console.log(req.url);
    res.sendFile(path.join(
      path.normalize(`${__dirname}/..`), 'client/index.html'
    ));
  });
}
