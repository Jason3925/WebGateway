var util = require('../tool/util');
var EventProxy = require('eventproxy');

var apiConference = require('../api/apiConference');


function csGet(req, res, next) {
  var ep = new EventProxy();
  var result = {};
  result['cssData'] = {};

  ep.all('cssData', function(cssData) {
    result.cssData = util.parseJSON(cssData);

    req.log.info('conferenceServerList SUCCESS');
    req.log.info(JSON.stringify(result));

    res.render('solomon/settings/conferenceServer/cs', {data: result});
  });
  ep.fail(function(err, msg) {
    req.log.error('ProvidersList ERROR');
    req.log.error(msg);
    res.json({err_code:'500', msg:err.msg || msg });
  });
  apiConference.conferenceServerList(req.query, util.done('cssData', ep, 'conferenceServerList ERROR'));
  
}
function addServerGet(req, res, next) {


  var result = {};
  result['csData'] = {};

  res.render('solomon/settings/conferenceServer/addServer', {type: 'add', data: result});

}
function addServerPost(req, res, next) {

  var ep = new EventProxy();
  var result = {};
  ep.all('data', function(data) {

    apiConference.conferenceServerCreateMCU(req.body, function(err, data) {
      //...
    }, address);

    req.log.info('conferenceServerCreate Success');
    result = util.parseJSON(data);
    res.json(result).end();
  });
  ep.fail(function(err,errMsg) {
    req.log.error(errMsg);
    res.json({err_code:'500', msg:err.msg || errMsg }).end();
  });

  var address = '';
  if(req.body && req.body.ip && req.body.port) {
    address = 'https://' + req.body.ip + ':' + '8878';
  }
  apiConference.conferenceServerCreate(req.body, util.done('data', ep, 'conferenceServerCreate ERROR'));

}
function updateServerGet(req, res, next) {

  //console.log('**********   test ip begin************');
  //
  //var newIp = util.toLong('192.168.1.233');
  //console.log(newIp);
  //console.log(util.fromLong(newIp));
  //
  //console.log('**********   test ip end************');

  var ep = new EventProxy();
  var result = {};
  result['csData'] = {};

  ep.all('csData', function(csData) {
    result.csData = util.parseJSON(csData);

    //if(req.query) {
    //  delete req.query.access_token;
    //  for(var o in req.query) {
    //    result.csData[o] = req.query[o];
    //  }
    //}

    req.log.info('conferenceServerShow SUCCESS');
    req.log.info(JSON.stringify(result));

    res.render('solomon/settings/conferenceServer/addServer', {type: 'update',data: result});
  });
  ep.fail(function(err, msg) {
    req.log.error('ProvidersList ERROR');
    req.log.error(msg);
    res.json({err_code:'500', msg:err.msg || msg });
  });
  var address = '';
  if(req.query && req.query.ip && req.query.port) {
    address = 'https://' + req.query.ip + ':' + req.query.port;
    //delete req.query.ip;
    //delete req.query.port;
  }
  apiConference.conferenceServerShow(req.query, util.done('csData', ep, 'conferenceServerShow ERROR'), address);
}
function updateServerPost(req, res, next) {

  var ep = new EventProxy();
  var result = {};
  ep.all('data', function(data) {
    apiConference.conferenceServerUpdateMCU(req.body, function(err, data) {
      // ...
    }, address);

    req.log.info('conferenceServerUpdate Success');
    result = util.parseJSON(data);
    res.json(result).end();
  });
  ep.fail(function(err,errMsg) {
    req.log.error(errMsg);
    res.json({err_code:'500', msg:err.msg || errMsg }).end();
  });
  var address = '';
  if(req.body && req.body.ip && req.body.port) {
    address = 'https://' + req.body.ip + ':' + req.body.port;
    delete req.body.ip;
    delete req.body.port;
  }
  apiConference.conferenceServerUpdate(req.body, util.done('data', ep, 'conferenceServerUpdate ERROR'));
  
}
function deleteServerPost(req, res, next) {
  var ep = new EventProxy();
  var result = {};
  ep.all('data', function(data) {
    apiConference.conferenceServerDestroyMCU(req.body, function(err, data) {
      // ...
    }, address);
    req.log.info('conferenceServerDestroy Success');
    result = util.parseJSON(data);
    res.json(result).end();
  });
  ep.fail(function(err,errMsg) {
    req.log.error(errMsg);
    res.json({err_code:'500', msg:err.msg || errMsg }).end();
  });


  var address = '';
  if(req.body && req.body.ip && req.body.port) {
    address = 'https://' + req.body.ip + ':' + req.body.port;
    delete req.body.ip;
    delete req.body.port;
  }
  apiConference.conferenceServerDestroy(req.body, util.done('data', ep, 'conferenceServerDestroy ERROR'));

}


exports.csGet = csGet;
exports.addServerGet = addServerGet;
exports.addServerPost = addServerPost;
exports.updateServerGet = updateServerGet;
exports.updateServerPost = updateServerPost;
exports.deleteServerPost = deleteServerPost;