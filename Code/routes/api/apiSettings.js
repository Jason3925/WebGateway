/**
 *
 *
 */
var emitter = require('../tool/emitter');


exports.settingsShow = function(data, callback) {
  emitter.get('/api/settings/show', data, callback);
};
exports.settingsWizardShow = function(data, callback) {
  emitter.get('/api/settings/pbx_mode_ip/show', data, callback);
};
exports.settingsUpdate = function(data, callback) {
  emitter.post('/api/settings/update', data, callback);
};
exports.settingsWizardUpdate = function(data, callback) {
  emitter.post('/api/settings/pbx_mode_ip/update', data, callback);
};