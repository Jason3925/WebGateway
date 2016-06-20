/**
 *
 */
var emitter = require('../tool/emitter');

exports.extensionCreate = function(data, callback) {
  emitter.voiceMail.post('/api/extensions/create', data, callback);
};
exports.extensionShow = function(data, callback) {
  emitter.voiceMail.get('/api/extensions/show', data, callback);
};
exports.extensionUpdate = function(data, callback) {
  emitter.voiceMail.post('/api/extensions/update', data, callback);
};
exports.extensionDestroy = function(data, callback) {
  emitter.voiceMail.post('/api/extensions/destroy', data, callback);
};



exports.voiceMailShow = function(data, callback) {
  emitter.get('/api/voice_mail/show', data, callback);
};
exports.voiceMailUpdate = function(data, callback) {
  emitter.post('/api/voice_mail/update', data, callback);
};
exports.voiceMailUpdateVM = function(data, callback) {
  emitter.voiceMail.post('/api/voice_mail/update', data, callback);
};

exports.greetingFileCreate = function(data, callback) {
  emitter.voiceMail.post('/api/extensions/greeting_file/create', data, callback);
};
exports.greetingFileUpdate = function(data, callback) {
  emitter.voiceMail.post('/api/extensions/greeting_file/update', data, callback);
};
exports.greetingFileDestroy = function(data, callback) {
  emitter.voiceMail.post('/api/extensions/greeting_file/destroy', data, callback);
};
exports.greetingFileList = function(data, callback) {
  emitter.voiceMail.get('/api/extensions/greeting_file/list', data, callback);
};



