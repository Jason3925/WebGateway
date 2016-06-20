/**
 *
 * @type {exports|module.exports}
 */
var emitter = require('../tool/emitter');

exports.login = function(data, callback) {
  emitter.post('/api/account/credentials/verify', data, callback);
};
exports.logout = function(data, callback) {
  emitter.post('/api/account/sign_out', data, callback);
};
exports.tokenRefresh = function(data, callback) {
  emitter.post('/api/account/token/refresh', data, callback);
};


