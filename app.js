var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var rateLimit = require("express-rate-limit");

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var userRouter = require('./routes/user')
// var studentRouter = require('./routes/students');
var audioRouter = require('./routes/audio');
// var productRouter = require('./routes/products');

var app = express();

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
22


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');



// const limiter = rateLimit({
//   windowMs: 10 * 60 * 1000,
//   max: 3,
// });

// app.use(limiter);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/audio', audioRouter);
app.use('/user', userRouter);
// app.use('/students', studentRouter);
// 





// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

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
