var emitter = require('../tool/emitter');

exports.tenantList = function(data, callback) {
  emitter.get('/api/account/list', data, callback);
};

exports.accountCreate = function(data, callback) {
  emitter.post('/api/account/create', data, callback);
};
exports.accountCreateVM = function(data, callback) {
  emitter.voiceMail.post('/api/account/create', data, callback);
};

exports.accountShow = function(data,callback) {
  emitter.get('/api/account/show', data, callback);
};

exports.accountUpdate = function(data, callback) {
  emitter.post('/api/account/update', data, callback);
};
exports.accountUpdateVM = function(data, callback) {
  emitter.voiceMail.post('/api/account/update', data, callback);
};

exports.accountDestroy = function(data, callback) {
  emitter.post('/api/account/destroy', data, callback);
};
exports.accountDestroyVM = function(data, callback) {
  emitter.voiceMail.post('/api/account/destroy', data, callback);
};
