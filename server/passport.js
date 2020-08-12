const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const RememberMeStrategy = require('passport-remember-me').Strategy;
const bcrypt = require('bcrypt');

const dbh = require('./db_handler').dbh;
const utils = require('./utils');

module.exports = function() {
  function consumeRememberMeToken(token, callback) {
    return dbh.pool.query({
      sql: ('SELECT * FROM `tokens` WHERE `token`=?'), values: [token]
    })
    .then((tokensRes) => {
      if (tokensRes.length > 0) {
        dbh.pool.query({
          sql: ('DELETE FROM `tokens` WHERE `token`=?'), values: [token]
        });
        return callback(null, tokensRes[0].account_id);
      }
      else { return callback(null, false); }
    })
    .catch((err) => { console.error(err); return callback(err); });
  }
  function saveRememberMeToken(token, accountId, callback) {
    dbh.pool.query({
      sql: ('INSERT INTO `tokens` VALUES (?, ?)'), values: [token, accountId]
    });
    return callback();
  }
  function issueToken(account, done) {
    var token = utils.randHex(64);
    saveRememberMeToken(token, account.id, function(err) {
      if (err) { return done(err); }
      return done(null, token);
    });
  }

  passport.serializeUser(function(account, done) {
    done(null, account.id);
  });
  passport.deserializeUser(function(id, done) {
    dbh.pool.query({
      sql: ('SELECT * FROM `accounts` WHERE `id`=?'), values: [accountId]
    })
    .then((accounts) => {
      if (accounts.length > 0) { done(null, accounts[0]); }
      else { done(null, false, {message: 'No matching account when deserializing user'}); }
    })
    .catch((err) => { console.error(err); done(err); });
  });

  passport.use(new LocalStrategy(
    function(username, password, done) {
      console.log('arguments');
      console.log(arguments);
      dbh.pool.query({
        sql: ('SELECT * FROM `accounts` WHERE `phone`=?'), values: [username]
      })
      .then((accounts) => {
        if (accounts.length > 0) {
          if (bcrypt.compareSync(password, accounts[0].password)) {
            return done(null, accounts[0]);
          }
          else { return done(null, false, { message: 'Invalid password' }) }
        }
        else { done(null, false, {message: 'No matching account for: '
          + utils.phoneNumberOut(username) }); }
      })
      .catch((err) => { console.error(err); done(err); });
    }
  ));

  passport.use(new RememberMeStrategy(
    function(token, done) {
      consumeRememberMeToken(token, function(err, accountId) {
        if (err) { return done(err); }
        if (!accountId) { return done(null, false); }

        return dbh.pool.query({
          sql: ('SELECT * FROM `accounts` WHERE `id`=?'), values: [accountId]
        })
        .then((accounts) => {
          if (accounts.length > 0) {
            return done(null, accounts[0]);
          }
          else { return done(null, false); }
        })
        .catch((err) => { console.error(err); return done(err); });
      });
    },
    issueToken
  ));
}
