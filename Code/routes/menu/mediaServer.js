var util = require('../tool/util');
var EventProxy = require('eventproxy');
var proxy = new EventProxy();

var apiMediaServer = require('../api/apiMediaServer');



function msGet(req, res, next) {

  //res.render('solomon/settings/mediaServer/ms');

  var ep = new EventProxy();
  var result = {};
  result['mssData'] = {};
  ep.all('mssData', function(mssData) {
    result.mssData = util.parseJSON(mssData);
    console.log(result);
    res.render('solomon/settings/mediaServer/ms', {data: result});
  });
  ep.fail(function(err, errMsg) {
    res.json({err_code:'500', msg:err.msg || errMsg }).end();
  });
  apiMediaServer.mediaServerList(req.query, util.done('mssData', ep, 'mediaServerList ERROR'));

}
function addServerGet(req, res, next) {
  var result = {};
  result['msData'] = {};

  res.render('solomon/settings/mediaServer/addServer', {type: 'add', data: result});
}
function addServerPost(req, res, next) {

  var ep = new EventProxy();
  var result = {};
  ep.all('data', function(data) {
    //pbx create is ok
    //发往mediaServer
    apiMediaServer.mediaServerCreateMS(req.body,function(err,data) {
      //这里不管成功与否
    });
    req.log.info('mediaServerCreate Success');
    result = util.parseJSON(data);
    res.json(result).end();
  });
  ep.fail(function(err,errMsg) {
    req.log.error(errMsg);
    res.json({err_code:'500', msg:err.msg || errMsg }).end();
  });
  apiMediaServer.mediaServerCreate(req.body, util.done('data', ep, 'mediaServerCreate ERROR'));
}

function updateServerGet(req, res, next) {

  var ep = new EventProxy();
  var result = {};
  result['msData'] = {};
  ep.all('msData', function(msData) {

    if(req.query) {
      delete req.query.access_token;
      for(var o in req.query) {
        msData[o] = req.query[o];
      }
    }
    result.msData = util.parseJSON(msData);
    console.log(result);
    result.msData.ip = req.query.ip;
    result.msData.port = req.query.port;
    res.render('solomon/settings/mediaServer/addServer', {type: 'update', data: result});
  });
  ep.fail(function(err, errMsg) {
    res.json({err_code:'500', msg:err.msg || errMsg }).end();
  });
  var address = '';
  if(req.query && req.query.ip && req.query.port) {
    address = 'https://' + req.query.ip + ':' + req.query.port;
    //delete req.query.ip;
    //delete req.query.port;
  }
  apiMediaServer.mediaServerShow(req.query, util.done('msData', ep, 'mediaServerShow ERROR'), address);


  //...
}
function updateServerPost(req, res, next) {

  var ep = new EventProxy();
  var result = {};
  ep.all('data', function(data) {
    //pbx udate is ok
    //转发请求到ms
    apiMediaServer.mediaServerUpdateMS(req.body, function(err, data) {
      //不管成功与否
    }, address);
    req.log.info('mediaServerUpdate Success');
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
  apiMediaServer.mediaServerUpdate(req.body, util.done('data', ep, 'mediaServerUpdate ERROR'));

}
function destroyServerPost(req, res, next) {

  var ep = new EventProxy();
  var result = {};
  ep.all('data', function(data) {
    req.log.info('mediaServerDestroy Success');
    result = util.parseJSON(data);
    res.json(result).end();
  });
  ep.fail(function(err,errMsg) {
    req.log.error(errMsg);
    res.json({err_code:'500', msg:err.msg || errMsg }).end();
  });
  apiMediaServer.mediaServerDestroy(req.body, util.done('data', ep, 'mediaServerDestroy ERROR'));

}

exports.msGet = msGet;
exports.addServerGet = addServerGet;
exports.addServerPost = addServerPost;
exports.updateServerGet = updateServerGet;
exports.updateServerPost = updateServerPost;
exports.destroyServerPost = destroyServerPost;
