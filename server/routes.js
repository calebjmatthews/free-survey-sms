'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const passport = require('passport');

const dbh = require('./db/db_handler').dbh;
const issueToken = require('./passport').issueToken;
const accountNewSubmission = require('./account_new_submission');
const accountExistingSubmission = require('./account_existing_submission');
const smsIncoming = require('./sms_incoming');
const paypalIncoming = require('./paypal_incoming');
const getSurveyResults = require('./db/get_survey_results');
const getMessageResults = require('./db/get_message_results');
const getAccountExisting = require('./db/get_account_existing');

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.status(403).send({message: 'Forbidden'});
}

module.exports = function(app) {
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  // app.use(express.session({ secret: 'what the thunder said' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(passport.authenticate('remember-me'));

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

  app.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, account, info) {
      if (err) { return next(err); }
      if (!account) {
        return res.status(200).send(info);
      }
      req.logIn(account, function(err) {
        if (err) { return next(err); }
        // Issue a remember me cookie if the option was checked
        if (!req.body.remember_me) {
          return res.status(200).send({message: 'Success', account: account});
        }
        issueToken(account, function(err, token) {
          if (err) { return next(err); }
          res.cookie('remember_me', token, { path: '/', httpOnly: true, maxAge: 604800000 });
          return res.status(200).send({message: 'Success', account: account});
        });

      });
    })(req, res, next);
  });

  app.get('/logout', function(req, res){
    // clear the remember me cookie when logging out
    res.clearCookie('remember_me');
    req.logout();
    res.redirect('/');
  });

  app.get('/api/survey_results/:survey_id', (req, res) => {
    getSurveyResults(req.params.survey_id)
    .then((gsrRes) => {
      res.status(200).send(JSON.stringify(gsrRes));
    })
    .catch((err) => {
      console.error(err);
    })
  });

  app.get('/api/message_results/:survey_id', ensureAuthenticated, (req, res) => {
    getMessageResults(req.params.survey_id)
    .then((gmrRes) => {
      res.status(200).send(JSON.stringify(gmrRes));
    })
    .catch((err) => {
      console.error(err);
    })
  });

  app.get('/api/get_account_existing/:account_id', ensureAuthenticated, (req, res) => {
    getAccountExisting(req.params.account_id)
    .then((gaeRes) => {
      res.status(200).send(JSON.stringify(gaeRes));
    })
    .catch((err) => {
      console.error(err);
    })
  })

  app.post('/api/account_new', (req, res) => {
    let payload = JSON.parse(req.body.payload);
    accountNewSubmission(payload)
    .then((anhRes) => {
      res.status(200).send('Survey inserted');
    })
    .catch((err) => {
      console.error(err);
    })
  });

  app.post('/api/account_existing', (req, res) => {
    let payload = JSON.parse(req.body.payload);
    accountExistingSubmission(payload)
    .then((aehRes) => {
      res.status(200).send('Survey inserted');
    })
    .catch((err) => {
      console.error(err);
    })
  });

  app.post('/api/sms_incoming', (req, res) => {
    res.status(200).send();
    smsIncoming(req.body)
    .then((siRes) => { })
    .catch((err) => {
      console.error(err);
    })
  });

  app.post('/api/paypal_incoming', (req, res) => {
    res.status(200).send();
    paypalIncoming(req.body)
    .then((piRes) => { })
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
