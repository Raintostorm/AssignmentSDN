require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var perfumeRouter = require('./routes/perfumeRouter');
var brandRouter = require('./routes/brandRouter');
var authRouter = require('./routes/authRouter');
var memberRouter = require('./routes/memberRouter');
var perfumeAdminRouter = require('./routes/perfumeAdminRouter');
var collectorRouter = require('./routes/collectorRouter');

var app = express();

// MongoDB connection
var mongoUrl = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sdn_assignment';
mongoose
  .connect(mongoUrl)
  .then(function () {
    console.log('MongoDB connected');
  })
  .catch(function (err) {
    console.log('MongoDB connection error:', err.message);
  });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/perfumes', perfumeRouter);
app.use('/brands', brandRouter);
app.use('/auth', authRouter);
app.use('/members', memberRouter);
app.use('/admin/perfumes', perfumeAdminRouter);
app.use('/collectors', collectorRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
