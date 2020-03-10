const express = require('express');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const { morgan } = require('./utils/');
const {
  notFoundHandler,
  defaultErrorHandler,
  rootRouter,
  userRouter,
} = require('./routes/');

const app = express();
app.set('trust proxy', 'loopback');

app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(favicon(path.join(__dirname, 'static', 'favicon.ico')));

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

// logging
app.use(morgan);

// router for '/'
app.use(rootRouter);

// router for '/user'
app.use('/user', userRouter);

// error handlers
app.use(notFoundHandler);
app.use(defaultErrorHandler);

module.exports = app;
