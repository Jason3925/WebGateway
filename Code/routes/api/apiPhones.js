var emitter = require('../tool/emitter');


exports.phonesListGet = function(data, callback) {
  emitter.get('/api/phones/list', data, callback);
};