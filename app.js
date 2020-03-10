'use strict'; 


const {morgan} = require('./utils/');
const {basic_router, not_found_handler, default_error_handler} = require('./routes/');

const express = require('express')
const favicon = require('serve-favicon');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');

const app = express();
app.set('trust proxy', 'loopback');

app.use(helmet());
app.use(cors({origin: '*' }));
app.use(favicon(path.join(__dirname, 'static', 'favicon.ico')))

app.use(morgan);
app.use(basic_router);

app.use(not_found_handler);
app.use(default_error_handler);

module.exports = app;