var express = require('express');
var router = express.Router();
var passport = require('passport');
var local_controller = require('../controllers/loginLocalController');
var user_controller = require('../controllers/userController');

router.get('/', user_controller.checkAuthenticated, user_controller.homepage);

router.get('/login', user_controller.checkNotAuthenticated, local_controller.login);

router.post('/login',
  passport.authenticate('local', { failureRedirect: '/login', failureMessage: true }),
  function (req, res) {
    res.redirect('/');
  });

router.get('/logout', user_controller.logout );

router.get('/auth/facebook', passport.authenticate('facebook',{scope:'email'}));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect : '/', failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });
  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login')
  }
module.exports = router;
