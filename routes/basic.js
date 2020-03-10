
// A default router for examples and tests

const express = require('express');
const createError = require('http-errors');
const { name, version } = require('../package.json');

const router = express.Router();

router.get('/error', (req, res, next) => next(new createError.NotImplemented('Not yet')));

router.get('/', (req, res, _next) => {
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
    <h1>${name}@${version}</h1>
  </html>`);
});

module.exports = router;
