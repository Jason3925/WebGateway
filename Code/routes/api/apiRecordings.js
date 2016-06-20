/**
 *
 *
 */
var emitter = require('../tool/emitter');


exports.recordingsList = function(data, callback) {
  emitter.get('/api/recordings/list', data, callback);
};
exports.recordingsDestroy = function(data, callback) {
  emitter.post('/api/recordings/destroy', data, callback);
};