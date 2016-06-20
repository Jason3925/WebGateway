/**
 *
 *
 */
var emitter = require('../tool/emitter');


exports.conferenceRoomList = function(data, callback) {
  emitter.get('/api/conference_room/list', data, callback);
};
exports.conferenceRoomCreate = function(data, callback) {
  emitter.post('/api/conference_room/create', data, callback);
};
exports.conferenceRoomShow = function(data, callback, address) {
  emitter.mcu.get('/api/conference_room/show', data, callback, address);
};
exports.conferenceRoomCreateMCU = function(data, callback, address) {
  emitter.mcu.post('/api/conference_room/create', data, callback, address);
};
exports.conferenceRoomCreate = function(data, callback) {
  emitter.post('/api/conference_room/create', data, callback);
};
exports.conferenceRoomUpdate = function(data, callback) {
  emitter.post('/api/conference_room/update', data, callback);
};
exports.conferenceRoomUpdateMCU = function(data, callback, address) {
  emitter.mcu.post('/api/conference_room/update', data, callback, address);
};
exports.conferenceRoomDestroy = function(data, callback) {
  emitter.post('/api/conference_room/destroy', data, callback);
};
exports.conferenceRoomDestroyMCU = function(data, callback) {
  emitter.mcu.post('/api/conference_room/destroy', data, callback);
};
exports.conferenceRoomParticipantsList = function(data, callback, address) {
  emitter.mcu.get('/api/conference_room/participants/list', data, callback, address);
};
exports.conferenceRoomParticipantsUpdate = function(data, callback, address) {
  emitter.mcu.post('/api/conference_room/participants/update', data, callback, address);
};


exports.conferenceServerList = function(data, callback) {
  emitter.get('/api/conference_server/list', data, callback);
};
exports.conferenceServerShow = function(data, callback, address) {
  emitter.mcu.get('/api/conference_server/show', data, callback, address);
};
exports.conferenceServerCreate = function(data, callback) {
  emitter.post('/api/conference_server/create', data, callback);
};
exports.conferenceServerCreateMCU = function(data, callback, address) {
  emitter.mcu.post('/api/conference_server/create', data, callback, address);
};
exports.conferenceServerUpdate = function(data, callback) {
  emitter.post('/api/conference_server/update', data, callback);
};
exports.conferenceServerUpdateMCU = function(data, callback, address) {
  emitter.mcu.post('/api/conference_server/update', data, callback, address);
};
exports.conferenceServerDestroy = function(data, callback) {
  emitter.post('/api/conference_server/destroy', data, callback);
};
exports.conferenceServerDestroyMCU = function(data, callback, address) {
  emitter.mcu.post('/api/conference_server/destroy', data, callback, address);
};





