/**
 *
 *
 */
var emitter = require('../tool/emitter');


exports.licenseShow = function(data, callback) {
  emitter.get('/api/license/show', data, callback);
};
exports.licenseUpdate = function(data, callback) {
  emitter.post('/api/license/update', data, callback);
};