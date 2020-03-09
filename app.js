'use strict'; 


const {request_logger} = require('./utils/logger');
const {basic_router} = require('./routes/');
const createError = require('http-errors');
const express = require('express')
const favicon = require('serve-favicon');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(favicon('./static/favicon.ico'));
app.use(helmet());
app.use(cors({origin: '*' }));

app.use(request_logger);
app.use(basic_router);


app.use(function notFoundHandler(req, res, next) {
  next(createError.NotFound(`${req.url}`));
});

// error handler
app.use(function defaultErrorHandler(err, req, res, _next) {
  res.locals.message = err.message;
  res.locals.status = err.status || 500;
  res.locals.error = process.env.NODE_ENV === 'development' ? err : {};
  res.status(res.locals.status);
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
    <h1>Error: ${res.locals.status}</h1>
    <h2>Message: ${res.locals.message}</h2>
    <p>${res.locals.error}</p>
  </html>`);
});


module.exports = app;