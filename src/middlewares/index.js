/**
 * @file All basic middlewares for authentication, errors and content negotiation
 * @author Romuald THION
 */

const { notFoundHandler, defaultErrorHandler } = require('./errorHandlers');
const { negotiateContentHandler } = require('./negotiateContentHandler');
const { authFromApiKeyHandler } = require('./authenticationHandler');

module.exports = {
  notFoundHandler,
  defaultErrorHandler,
  negotiateContentHandler,
  authFromApiKeyHandler,
};
