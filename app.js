var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var rateLimit = require("express-rate-limit");

var indexRouter = require('./routes/index')
var authRouter = require('./routes/auth');
var userRouter = require('./routes/user')
var audioRouter = require('./routes/audio');
var commentRouter = require('./routes/comments');

var app = express();

// swagger setup
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/audio', audioRouter);
app.use('/user', userRouter);
app.use('/comment', commentRouter);


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
