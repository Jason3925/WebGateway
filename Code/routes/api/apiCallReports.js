/**
 *
 *
 */
var emitter = require('../tool/emitter');


exports.callReportsList = function(data, callback) {
  emitter.get('/api/call_reports/list', data, callback);
};
exports.callReportsShow = function(data, callback) {
  emitter.get('/api/call_reports/show', data, callback);
};
exports.callReportsDownload = function(data, callback) {
  emitter.get('/api/call_reports/download', data, callback);
};
exports.callReportsSearch = function(data, callback) {
  emitter.post('/api/call_reports/export', data, callback);
};
exports.callSessionSearch = function(data, callback) {
  emitter.post('/api/call_sessions/search', data, callback);
};