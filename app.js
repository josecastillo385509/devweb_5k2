var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var apiRouter = require('./api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// logging de solicitudes HTTP
app.use(logger('dev', { skip: function() { return process.env.NODE_ENV === 'test'; } }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', apiRouter);

app.use('/api', function(req, res) {
  res.status(404).json({
    message: 'Route not found: ' + req.method + ' ' + req.originalUrl,
    data: {}
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  var status = err.status || 500;

  if (/^\/api(\/|$)/.test(req.path)) {
    var message = err.type === 'entity.parse.failed'
      ? 'Invalid JSON body'
      : (status < 500 ? err.message : 'Internal server error');
    return res.status(status).json({ message: message, data: {} });
  }

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(status);
  res.render('error');
});

module.exports = app;
