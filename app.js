'use strict'; 

const debug = require('debug')('lifap5:app');
const {name, version} = require('./package.json');
require('dotenv').config();

const express = require('express');

const app = express();

app.get('/', (req, res) => res.send(`
<!DOCTYPE html>
<html lang="en">
  <h1>${name}@${version}</h1>
</html>`))

module.exports = app;