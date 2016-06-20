/**
 *
 *
 */
var emitter = require('../tool/emitter');


exports.systemExtensionsList = function(data, callback) {

  data.start_position = data.start_position || 1;
  data.end_position = data.end_position || 10;

  emitter.get('/api/system_extensions/list', data, callback);
};