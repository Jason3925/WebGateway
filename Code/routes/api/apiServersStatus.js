/**
 *
 */
var emitter = require('../tool/emitter');

//var service = require('../node/addon.node');


exports.servicesStatus = function(data, callback) {
  emitter.get('/api/services/status', data, callback);
};
exports.servicesUpdate = function(data, callback) {
  emitter.post('/api/services/update', data, callback);

  //console.log(data);

  //service.StartWinService('3CX PhoneSystem Database Server', )




};