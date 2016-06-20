/**
 *
 *
 */
var emitter = require('../tool/emitter');


exports.contactsShow = function(data, callback) {
  emitter.get('/api/contacts/show', data, callback);
};
exports.contactsList = function(data, callback) {
  emitter.get('/api/contacts/list', data, callback);
};
exports.contactsCreate = function(data, callback) {
  emitter.post('/api/contacts/create', data, callback);
};
exports.contactsUpdate = function(data, callback) {
  emitter.post('/api/contacts/update', data, callback);
};
exports.contactsDestroy = function(data, callback) {
  emitter.post('/api/contacts/destroy', data, callback);
};


exports.contactsGroupList = function(data, callback) {
  emitter.get('/api/contacts/group/list', data, callback);
};
exports.contactsGroupCreate = function(data, callback) {
  emitter.post('/api/contacts/group/create', data, callback);
};
exports.contactsGroupUpdate = function(data, callback) {
  emitter.post('/api/contacts/group/update', data, callback);
};
exports.contactsGroupDestroy = function(data, callback) {
  emitter.post('/api/contacts/group/destroy', data, callback);
};

