var emitter = require('../tool/emitter');


exports.summaryShow = function(data, callback) {
  emitter.get('/api/call_manager/summary', data, callback);
};