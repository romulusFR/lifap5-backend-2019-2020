const express = require('express');
const favicon = require('serve-favicon');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const { morgan, config } = require('./utils/');
const {
  notFoundHandler,
  defaultErrorHandler,
  rootRouter,
  userRouter,
} = require('./routes/');

const app = express();
app.set('trust proxy', 'loopback');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(favicon(path.join(__dirname, 'static', 'favicon.ico')));

app.use(express.json());

// http logging
app.use(morgan);

// a middleware to store appname and version once and for all
app.use((req, res, next) => {
  res.locals.appname = config.appname;
  res.locals.version = config.version;
  next();
});

// router for '/'
app.use(rootRouter);

// router for '/user'
app.use('/user', userRouter);

// error handlers
// curl -H "Accept: application/json" http://localhost:3000/doesnotexists/
app.use(notFoundHandler);
app.use(defaultErrorHandler);

module.exports = app;
