var User = require('../models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');

passport.use(new LocalStrategy(
    function (username, password, done) {

        User.findOne({
            username : username
        }).then(function (user) {
            bcrypt.compare(password, user.password, function (err, result) {
                if (err) {
                    return done(err);
                }
                if (!result) {
                    return done(null, false, { message: 'Incorrect username or password' });
                }
                return done(null, user);
            })
        }).catch(function (err) {
            return done(err);
        })
    }
));

exports.login = function (req, res) {
    res.render('login_views/login.ejs', { title: 'Login to Account' });
};
