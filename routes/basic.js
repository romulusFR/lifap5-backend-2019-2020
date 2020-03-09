'use strict'; 

// A default router for examples and tests

const express = require('express');
const createError = require('http-errors');
const {name, version} = require('../package.json');

const router = express.Router();

router.get('/error', function(req, res, next) {
  return next(new createError.NotImplemented('Not yet'));
});

router.get('/', function(req, res, next) {
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
    <h1>${name}@${version}</h1>
  </html>`);
});

module.exports = router;