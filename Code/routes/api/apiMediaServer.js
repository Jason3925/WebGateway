/**
 *
 */
var emitter = require('../tool/emitter');

/**
 * 开发使用挡板
 * 测试时要切换到mediaServer服务器
 */
exports.mediaServerList = function(data, callback) {
  emitter.get('/api/media_server/list', data, callback);
};
exports.mediaServerShow = function(data, callback, address) {
  emitter.ms.get('/api/media_server/show', data, callback, address);
};
exports.mediaServerCreate = function(data, callback) {
  emitter.post('/api/media_server/create', data, callback);
};
exports.mediaServerCreateMS = function(data, callback) {
  emitter.ms.post('/api/media_server/create', data, callback);
};
exports.mediaServerUpdate = function(data, callback) {
  emitter.post('/api/media_server/update', data, callback);
};
exports.mediaServerUpdateMS = function(data, callback, address) {
  emitter.ms.post('/api/media_server/update', data, callback, address);
};
exports.mediaServerDestroy = function(data, callback) {
  emitter.post('/api/media_server/destroy', data, callback);
};



