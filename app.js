const express = require('express');
const favicon = require('serve-favicon');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const { morgan } = require('./utils/');
const {
  basicRouter,
  notFoundHandler,
  defaultErrorHandler,
} = require('./routes/');

const app = express();
app.set('trust proxy', 'loopback');

app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(favicon(path.join(__dirname, 'static', 'favicon.ico')));

app.use(morgan);
app.use(basicRouter);

app.use(notFoundHandler);
app.use(defaultErrorHandler);

module.exports = app;
