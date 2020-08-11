'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const accountNewHandle = require('./account_new');
const smsIncoming = require('./sms_incoming');
const getSurveyResults = require('./get_survey_results');
const getMessageResults = require('./get_message_results');

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

  app.get('/api/survey_results/:survey_id', (req, res) => {
    getSurveyResults(req.params.survey_id)
    .then((gsrRes) => {
      res.status(200).send(JSON.stringify(gsrRes));
    })
    .catch((err) => {
      console.error(err);
    })
  })

  app.get('/api/message_results/:survey_id', (req, res) => {
    getMessageResults(req.params.survey_id)
    .then((gmrRes) => {
      res.status(200).send(JSON.stringify(gmrRes));
    })
    .catch((err) => {
      console.error(err);
    })
  })

  app.post('/api/account_new', (req, res) => {
    let payload = JSON.parse(req.body.payload);
    accountNewHandle(payload)
    .then((anhRes) => {
      res.status(200).send('Survey inserted');
    })
    .catch((err) => {
      console.error(err);
    })
  })

  app.post('/api/sms_incoming', (req, res) => {
    res.status(200).send();
    smsIncoming(req.body)
    .then((anhRes) => { })
    .catch((err) => {
      console.error(err);
    })
  })

  app.all('/*', (req, res) => {
    res.sendFile(path.join(
      path.normalize(`${__dirname}/..`), 'client/index.html'
    ));
  });
}
