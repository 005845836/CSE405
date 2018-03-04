/* 
 * This module exports an Express Router that manages sessions 
 * and login/logout. Requests from non-logged-in users are
 * redirected to the login page.
 *
 * This module relies on username being in the session object
 * to indicate the state of being logged in.
 *
 * This module places a reference to the session object in
 * the request object `req`.
 * */

const express     = require('express');
const sessions    = require('./sessions.js');
const db          = require('./db.js');

const urlencodedParser = express.urlencoded({ extended: false });

const router = express.Router();

module.exports = router;

router.use(function(req, res, next) {
  sessions.filter(req, res); 
  //req.session = sessions.getSession(req, res);
  next();
});

router.post('/login', urlencodedParser, function(req, res) {
  const username = req.body['username'];
  const password = req.body['password'];
  db.getUser(username, password, (user) => {
    if (user === null) {
      res.redirect('/login.html');
    } else {
      req.session.username = username;
      res.redirect('/');
    }
  });
});

router.post('/logout', function(req, res) {
  delete req.session.username;
  res.redirect('/login.html');
});

router.use(function(req, res, next) {
  if (req.session.hasOwnProperty('username')) {
    next();
  } else {
    res.redirect('/login.html');
  }
});
