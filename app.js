require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const indexRouter = require('./routes/index');
const userRouter = require('./routes/users');
const articlesRouter = require('./routes/articles');
const scoresRouter = require('./routes/scores');

const app = express();

// Logging http requests
app.use((req, res, next) => {
  console.log('=================================================');
  console.log('Current Request Method', req.method);
  if (req.body) console.log('Request Body', req.body);
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const whitelist = [
  'http://127.0.0.1:3000',
  'http://localhost:3000',
  'http://mini-game-states-client.s3-website.ap-northeast-2.amazonaws.com',
  'http://14.41.86.57:4010',
];

app.use(
  cors({
    origin(origin, callback) {
      // allow requests with no origin
      if (!origin) return callback(null, true);
      if (whitelist.indexOf(origin) === -1) {
        const message =
          "The CORS policy for this origin doesn't " +
          'allow access from the particular origin.';
        return callback(new Error(message), false);
      }
      return callback(null, true);
    },
    credentials: true,
  }),
);

app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/articles', articlesRouter);
app.use('/scores', scoresRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
