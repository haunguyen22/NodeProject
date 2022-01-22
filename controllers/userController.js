var User = require('../models/user');
var passport = require('passport');

passport.serializeUser(function (user, done) {
    if (user.googleID) {
        done(null, user)
    }
    else {
        done(null, user.id);
    }
});

passport.deserializeUser(function (id, done) {

    if (id.id) {
        done(null, {
            username: id.displayName,
        })
    }
    else {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    }

});

exports.checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect('/login')
}

exports.checkNotAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}
exports.homepage = function (req, res) {
    res.render('index.ejs', { title: 'Homepage', username: req.user.username });
};
exports.logout = function (req, res) {
    req.logout();
    res.redirect('/login');
  }