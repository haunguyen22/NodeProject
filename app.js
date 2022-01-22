const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
// require routers here
const indexRouter = require('./routes/index');

const connectDB = require('./config/db');
var passport = require('passport');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(function (req, res, next) {
  var msgs = req.session.messages || [];
  res.locals.messages = msgs;
  res.locals.hasMessages = !!msgs.length;
  req.session.messages = [];
  next();
});
app.use(passport.authenticate('session'));
//connect mongoDB
connectDB();

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


//app.js
//Khai báo các package sẽ sử dụng
//const passport = require('passport');
const FacebookStrategy  = require('passport-facebook').Strategy;
const session  = require('express-session');
const bodyParser = require('body-parser');
const config = require('./config');
const routes = require('./routes');
//const app = express();

// Passport session setup. 
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Sử dụng FacebookStrategy cùng Passport.
passport.use(new FacebookStrategy({
    clientID: config.facebook_key,
    clientSecret:config.facebook_secret ,
    callbackURL: config.callback_url
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      console.log(accessToken, refreshToken, profile, done);
      return done(null, profile);
    });
  }
));
var cors = require('cors')
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs'); // sử dụng view ejs
app.use(cookieParser()); //Parse cookie
app.use(bodyParser.urlencoded({ extended: false })); //Parse body để get data
app.use(session({ secret: 'keyboard cat', key: 'sid'}));  //Save user login
app.use(passport.initialize());
app.use(passport.session());
app.use(cors())
app.use('/', routes);

//app.listen(3000);
module.exports = app;
