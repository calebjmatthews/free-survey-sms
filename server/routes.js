'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const passport = require('passport');

const dbh = require('./db_handler').dbh;
const accountNewHandle = require('./account_new');
const smsIncoming = require('./sms_incoming');
const getSurveyResults = require('./get_survey_results');
const getMessageResults = require('./get_message_results');
const issueToken = require('./passport').issueToken;

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
        console.log('arguments2');
        console.log(arguments);
        return res.status(200).send(info);
      }
      req.logIn(account, function(err) {
        if (err) { return next(err); }
        // Issue a remember me cookie if the option was checked
        if (!req.body.remember_me) {
          return res.status(200).send({message: 'Success', account: account});
        }


        console.log('req.body for remember me');
        console.log(req.body);
        issueToken(account, function(err, token) {
          if (err) { return next(err); }
          res.cookie('remember_me', token, { path: '/', httpOnly: true, maxAge: 604800000 });
          return res.status(200).send({message: 'Success', account: req.body.account});
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

  app.post('/api/account_new', (req, res) => {
    let payload = JSON.parse(req.body.payload);
    accountNewHandle(payload)
    .then((anhRes) => {
      res.status(200).send('Survey inserted');
    })
    .catch((err) => {
      console.error(err);
    })
  });

  app.post('/api/sms_incoming', (req, res) => {
    res.status(200).send();
    smsIncoming(req.body)
    .then((anhRes) => { })
    .catch((err) => {
      console.error(err);
    })
  });

  app.all('/*', (req, res) => {
    res.sendFile(path.join(
      path.normalize(`${__dirname}/..`), 'client/index.html'
    ));
  });
}
