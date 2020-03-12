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
  openApiRouter,
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
app.use('/', rootRouter);

// router for swagger-ui on swagger-jsdoc
app.use('/api-docs', openApiRouter);

// router for user management
app.use('/users', userRouter);



// error handlers
app.use(notFoundHandler);
app.use(defaultErrorHandler);

module.exports = app;
