var emitter = require('../tool/emitter');


exports.billingList = function(data, callback) {
  emitter.get('/api/billing/list', data, callback);
};
exports.billingCreate = function(data, callback) {
  emitter.post('/api/billing/create', data, callback);
};
exports.billingUpdate = function(data, callback) {
  emitter.post('/api/billing/update', data, callback);
};
exports.billingDestroy = function(data, callback) {
  emitter.post('/api/billing/destroy', data, callback);
};
