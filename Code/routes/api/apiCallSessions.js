/**
 *
 *
 */
var emitter = require('../tool/emitter');


exports.callSessionList = function(data, callback) {
  data.start_position = data.start_position || 1;
  data.end_position = data.end_position || 10;
  emitter.get('/api/call_sessions/list', data, callback);
};
exports.callSessionCreate = function(data, callback) {
  emitter.post('/api/call_sessions/create', data, callback);
};
exports.callSessionDestroy = function(data, callback) {
  emitter.post('/api/call_sessions/destroy', data, callback);
};