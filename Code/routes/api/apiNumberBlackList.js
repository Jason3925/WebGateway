/**
 *
 */
var emitter = require('../tool/emitter');

/**
 * 开发使用挡板
 * 测试时要切换到mediaServer服务器
 */
exports.numberBlackListList = function(data, callback) {
  emitter.get('/api/number_blacklist/list', data, callback);
};
exports.numberBlackListCreate = function(data, callback) {
  emitter.post('/api/number_blacklist/create', data, callback);
};
exports.numberBlackListDestroy = function(data, callback) {
  emitter.post('/api/number_blacklist/destroy', data, callback);
};