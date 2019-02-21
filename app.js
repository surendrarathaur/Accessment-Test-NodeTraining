// dependencies
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const logger = require('morgan');
const jwt = require('jsonwebtoken');
const config = require('./config/config');
const routeUser = require('./routes/User');
const routePost = require('./routes/Post');
const routeComment = require('./routes/Comment');

// Connect mongodb database with mongoose
mongoose.connect('mongodb://localhost:27017/AccessmentTest',{ useNewUrlParser: true});
var db = mongoose.connection;   

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
});

var app = express();

//use sessions for tracking logins
app.use(session({
    secret: 'Accessment Test',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: db
    })
}));

// add public folder 
app.use(express.static(path.join(__dirname, 'public')));
// logger incoming requests
app.use(logger('dev'));
// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// parse cookie incoming requests
app.use(cookieParser());

// include routes files
app.use('/users', routeUser);
app.use('/posts', routePost);
app.use('/comments', routeComment);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('File Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('File Not Found');
    err.status = 404;
    next(err);
  });
  
// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send(err.message);
});

// listen on port 3000
app.listen(3000, function () {
    console.log('Express app listening on port 3000');
});