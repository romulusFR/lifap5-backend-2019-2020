/**
 * @file The main express application, to be loaded by server.js
 * @author Romuald THION
 */

const express = require('express');
const favicon = require('serve-favicon');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const { morgan, config } = require('./config');

const { notFoundHandler, defaultErrorHandler } = require('./middlewares');

const {
  apiDocsRouter,
  indexRouter,
  quizzesRouter,
  usersRouter,
} = require('./components');

const app = express();

// store appname and version once and for all
app.locals.appname = config.appname;
app.locals.version = config.version;
app.locals.description = config.description;
app.locals.env = config.env;
app.locals.pageLimit = config.pageLimit;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// security, disabled in non production
if (config.env === 'production') {
  app.set('trust proxy', 'loopback');
  app.use(helmet());
}
app.use(cors({ origin: '*' }));

// static content
app.use(favicon(path.join(__dirname, '../static', 'favicon.ico')));
app.use('/', express.static(path.join(__dirname, '../static')));
app.use('/client', express.static(path.join(__dirname, '../client')));

// body-parser
app.use(express.json());

// http logging, after static content
app.use(morgan);

// router for '/'
app.use('/', indexRouter(app));

// router for swagger-ui on swagger-jsdoc
app.use('/api-docs', apiDocsRouter(app));

// router for user management
app.use('/users', usersRouter(app));

// router for quiz management
app.use('/quizzes', quizzesRouter(app));

// error handlers
app.use(notFoundHandler(app));
app.use(defaultErrorHandler(app));

module.exports = app;
