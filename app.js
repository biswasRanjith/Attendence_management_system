var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const expressLayouts = require('express-ejs-layouts');
var methodOverride = require('method-override');
const mongoose = require('mongoose');
const passport = require('passport');  // Passport middleware used for authentication users and request
const flash = require('connect-flash'); // used for dispalying error/success messages
const session = require('express-session');
var bodyParser = require('body-parser');


//database url
const dbConfig = require('./config/database.config.js');

//routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var traineeRouter = require('./routes/trainee.js');
var coordinatorRouter = require('./routes/coordinator.js');


var app = express();

//code to disable caching( till line no. 30 )
app.disable('view cache');
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private')
  next()
})
const nocache = require('nocache');
app.use(nocache());
app.set('etag', false);    // Search what is ETag for more info. 

app.use(methodOverride('_method'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Passport Config
require('./config/passportAuth')(passport);

//database connection
mongoose.connect(dbConfig.url, {
  useNewUrlParser: true
}).then(() => {
  console.log("Database connected");    
}).catch(err => {
  console.log('Could not connect to the database. Exiting now...', err);
  process.exit();
});


// EJS view engine setup. layout.ejs file in views folder is the basic layout into which other pages load
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('view engine', 'ejs');

//default generated code
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'config')));
app.use(express.static(path.join(__dirname, 'models')));

//for creating session
// https://stackoverflow.com/questions/40381401/when-to-use-saveuninitialized-and-resave-in-express-session
app.use(
  session({
    secret: 'My Secret', //can be any value...used to encrypt session...prevents others from gaining access to someone's session. Only a session with this key is considered.
    resave: true,
    saveUninitialized: true,
    rolling: true,
    cookie:{
      expires:300000
    }
  })
);

// Passport middleware used for authentication users and request
app.use(passport.initialize());
app.use(passport.session());

// Connect flash // used for dispalying error/success messages
app.use(flash());
// Global variables....We can assign any text to these variables and display those messages anywhere using variable name.
//3 variables success_msg, error_msg, error 
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.info_msg = req.flash('info_msg');
  res.locals.error = req.flash('error');
  next();
});

//routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/trainee', traineeRouter);
app.use('/coordinator', coordinatorRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.title = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
