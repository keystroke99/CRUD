const express = require('express');
const logger = require('morgan');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
const passport = require('passport');
const pe = require('parse-error');
const cors = require('cors');
const v1 = require('./routes/v1');

const app = express();

const CONFIG = require('./config/config');

// View Engine
app.engine('handlebars', exphbs({ defaultLayout: 'layout' }));
app.set('view engine', 'handlebars');
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// Set Static Folder
app.use(express.static(path.join(__dirname, 'views')));
// Expose Media Folder
app.use('/media', express.static(__dirname + '/media'));

//Passport
app.use(passport.initialize());

//Log Env
console.log("Environment:", CONFIG.app)



//DATABASE
const models = require("./models");

// CORS
app.use(cors());


app.use('/v1', v1);

app.use('/', function (req, res) {
  res.statusCode = 200; //send the appropriate status code
  res.json({
    status: false,
    message: "FASAK",
    data: {}
  })
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err)
});

module.exports = app;

process.on('unhandledRejection', error => {
  console.error('Uncaught Error', pe(error));
});