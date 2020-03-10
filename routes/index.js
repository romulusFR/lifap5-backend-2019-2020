'use strict'; 

// all routers are exported from this file

const basic_router = require('./basic');
const {not_found_handler, default_error_handler} = require('./error');

module.exports.basic_router = basic_router;
module.exports.not_found_handler = not_found_handler;
module.exports.default_error_handler = default_error_handler;
