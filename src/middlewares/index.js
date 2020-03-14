/**
 * @file All basic middlewares for authentication, errors and content negotiation
 * @author Romuald THION
 */

const notFoundHandler = require('./notFoundHandler');
const defaultErrorHandler = require('./defaultErrorHandler');
const negotiateContentHandler = require('./negotiateContentHandler');
const authFromApiKeyHandler = require('./authFromApiKeyHandler');

module.exports = {
  notFoundHandler,
  defaultErrorHandler,
  negotiateContentHandler,
  authFromApiKeyHandler,
};
