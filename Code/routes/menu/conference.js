var util = require('../tool/util');
var EventProxy = require('eventproxy');

var apiConference = require('../api/apiConference');
var apiExtensions = require('../api/apiExtensions');


function coGet(req, res, next) {

  var ep = new EventProxy();
  var result = {};
  result['crsData'] = {};

  ep.all('crsData', function(crsData) {
    result.crsData = util.parseJSON(crsData);

    req.log.info('conferenceRoomList SUCCESS');
    req.log.info(JSON.stringify(result));

    if (result.crsData && result.crsData.rooms && result.crsData.count > 0) {
      result.crsData.rooms.map(function(data, key) {
        result.crsData.rooms[key].server_ip = util.toLong(data.server_ip);
      })
    }

    res.render('solomon/conference/co', {data: result});
  });
  ep.fail(function(err, msg) {
    req.log.error('ProvidersList ERROR');
    req.log.error(msg);
    res.json({err_code:'500', msg:err.msg || msg });
  });
  apiConference.conferenceRoomList(req.query, util.done('crsData', ep, 'conferenceRoomList ERROR'));

}

function addRoomGet(req, res, next) {
  var result = {};
  result['crData'] = {};
  res.render('solomon/conference/addRoom', {data: result});
}

function addRoomPost(req, res, next) {

  var ep = new EventProxy();
  var result = {};
  ep.all('data', function(data) {
    req.log.info('conferenceRoomCreate Success');
    result = util.parseJSON(data);

    var address = 'https://' + data.server_ip + ':' + '8878';

    if(result.room_number && result.room_extension_password) {
      req.body.room_number = result.room_number;
      req.body.room_extension_password = result.room_extension_password;
      apiConference.conferenceRoomCreateMCU(req.body, function(err, data) {
        // ...
      }, address);
    }

    res.json(result).end();
  });
  ep.fail(function(err,errMsg) {
    req.log.error(errMsg);
    res.json({err_code:'500', msg:err.msg || errMsg }).end();
  });
  apiConference.conferenceRoomCreate(req.body, util.done('data', ep, 'conferenceRoomCreate ERROR'));
}

function updateRoomGet(req, res, next) {

  var ep = new EventProxy();
  var result = {};
  result['crData'] = {};

  ep.all('crData', function(crData) {
    result.crData = util.parseJSON(crData);

    req.log.info('conferenceRoomShow SUCCESS');
    req.log.info(JSON.stringify(result));

    res.render('solomon/conference/addRoom', {data: result});
  });
  ep.fail(function(err, msg) {
    req.log.error('ProvidersList ERROR');
    req.log.error(msg);
    res.json({err_code:'500', msg:err.msg || msg });
  });

  var address = 'https://' + util.fromLong(req.query.ip) + ':8878';


  apiConference.conferenceRoomShow(req.query, util.done('crData', ep, 'conferenceRoomShow ERROR'), address);
}

function updateRoomPost(req, res, next) {

  var ep = new EventProxy();
  var result = {};
  ep.all('data', function(data) {
    req.log.info('conferenceRoomUpdate Success');
    result = util.parseJSON(data);

    if(result.room_number && result.room_extension_password) {
      req.body.room_number = result.room_number;
      req.body.room_extension_password = result.room_extension_password;
      var address = 'https://' + data.server_ip + ':' + '8878';
      apiConference.conferenceRoomUpdateMCU(req.body, function(err, data) {
        // ...
      }, address);
    }

    res.json(result).end();
  });
  ep.fail(function(err,errMsg) {
    req.log.error(errMsg);
    res.json({err_code:'500', msg:err.msg || errMsg }).end();
  });
  apiConference.conferenceRoomUpdate(req.body, util.done('data', ep, 'conferenceRoomUpdate ERROR'));


}

function deleteRoomPost(req, res, next) {

  var ep = new EventProxy();
  var result = {};
  ep.all('data', function(data) {
    apiConference.conferenceRoomDestroyMCU(req.body, function(err, data) {
      //...
    });
    req.log.info('conferenceRoomDestroy Success');
    result = util.parseJSON(data);
    res.json(result).end();
  });
  ep.fail(function(err,errMsg) {
    req.log.error(errMsg);
    res.json({err_code:'500', msg:err.msg || errMsg }).end();
  });
  apiConference.conferenceRoomDestroy(req.body, util.done('data', ep, 'conferenceRoomDestroy ERROR'));

}


function member(req, res, next) {

  var ep = new EventProxy();
  var result = {};
  result['crpsData'] = {};
  result['esData'] = {};
  result['crData'] = {};

  ep.all('crpsData', 'esData', 'crData', function(crpsData, esData, crData) {
    result.crpsData = util.parseJSON(crpsData);
    result.esData = util.parseJSON(esData);
    result.crData = util.parseJSON(crData);
    result.crData.server_ip = req.query.ip;

    req.log.info('conferenceRoomParticipantsList SUCCESS');
    req.log.info(JSON.stringify(result));

    res.render('solomon/conference/members', {data: result});
  });
  ep.fail(function(err, msg) {
    req.log.error('conferenceRoomParticipantsList ERROR');
    req.log.error(msg);
    res.json({err_code:'500', msg:err.msg || msg });
  });
  if (req.query && !req.query.cursor) req.query.cursor = 1;
  var address = 'https://' + util.fromLong(req.query.ip) + ':8878';
  apiConference.conferenceRoomParticipantsList(req.query, util.done('crpsData', ep, 'conferenceRoomParticipantsList ERROR'), address);
  apiExtensions.extensionList(req.query, util.done('esData', ep, 'extensionList ERROR'));
  apiConference.conferenceRoomShow(req.query, util.done('crData', ep, 'conferenceRoomShow ERROR'), address)
}

function participantsUpdate(req, res, next) {

  var ep = new EventProxy();
  var result = {};
  ep.all('data', function(data) {
    req.log.info('conferenceRoomParticipantsUpdate Success');
    result = util.parseJSON(data);
    res.json(result).end();
  });
  ep.fail(function(err,errMsg) {
    req.log.error(errMsg);
    res.json({err_code:'500', msg:err.msg || errMsg }).end();
  });
  var address = 'https://' + util.fromLong(req.body.ip) + ':8878';
  apiConference.conferenceRoomParticipantsUpdate(req.body, util.done('data', ep, 'conferenceRoomParticipantsUpdate ERROR'), address);

}


exports.coGet = coGet;
exports.addRoomGet = addRoomGet;
exports.addRoomPost = addRoomPost;
exports.updateRoomGet = updateRoomGet;
exports.updateRoomPost = updateRoomPost;
exports.deleteRoomPost = deleteRoomPost;



exports.participants = member;
exports.participantsUpdatePost = participantsUpdate;