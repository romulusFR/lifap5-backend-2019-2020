/**
 * @file The main express application, to be loaded by server.js
 * @author Romuald THION
 */

const express = require('express');
const favicon = require('serve-favicon');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const { morgan, config } = require('./config/');

const { notFoundHandler, defaultErrorHandler } = require('./middlewares/');

const {
  apiDocsRouter,
  indexRouter,
  quizzesRouter,
  usersRouter,
} = require('./components/');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// security
app.set('trust proxy', 'loopback');
app.use(helmet());
app.use(cors({ origin: '*' }));

// static content
app.use(favicon(path.join(__dirname, '../static', 'favicon.ico')));
app.use('/', express.static(path.join(__dirname, '../static')));

// body-parser
app.use(express.json());

// http logging, after static content
app.use(morgan);

// a middleware to store appname and version once and for all
app.use((req, res, next) => {
  res.locals.appname = config.appname;
  res.locals.version = config.version;
  next();
});

// // router for '/'
// app.use('/', indexRouter);

// // router for swagger-ui on swagger-jsdoc
// app.use('/api-docs', apiDocsRouter);

// // router for user management
// app.use('/users', usersRouter);

// // router for quiz management
// app.use('/quizzes', quizzesRouter);

// error handlers
app.use(notFoundHandler);
app.use(defaultErrorHandler);

module.exports = app;
