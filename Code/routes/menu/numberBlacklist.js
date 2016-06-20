var util = require('../tool/util');
var EventProxy = require('eventproxy');
var proxy = new EventProxy();

var apiBlackList = require('../api/apiNumberBlackList');


function nbGet(req, res, next) {


  var ep = new EventProxy();
  var result = {};
  result['nbsData'] = {};

  ep.all('nbsData', function(nbsData) {
    result.nbsData = util.parseJSON(nbsData);

    req.log.info('numberBlackListList SUCCESS');
    req.log.info(JSON.stringify(result));

    res.render('solomon/settings/numberBlacklist/nb', {data: result});
  });
  ep.fail(function(err, msg) {
    req.log.error('ProvidersList ERROR');
    req.log.error(msg);
    res.json({err_code:'500', msg:err.msg || msg });
  });
  apiBlackList.numberBlackListList(req.query, util.done('nbsData', ep, 'numberBlackListList ERROR'));
  
  
  //res.render('solomon/settings/numberBlacklist/nb');

}
function addBlacklistGet(req, res, next) {

  res.render('solomon/settings/numberBlacklist/addNumberBlacklist');

}
function addBlackListPost(req, res, next) {
  var ep = new EventProxy();
  var result = {};
  ep.all('data', function(data) {
    req.log.info('numberBlackListCreate Success');
    result = util.parseJSON(data);
    res.json(result).end();
  });
  ep.fail(function(err,errMsg) {
    req.log.error(errMsg);
    res.json({err_code:'500', msg:err.msg || errMsg }).end();
  });
  apiBlackList.numberBlackListCreate(req.body, util.done('data', ep, 'numberBlackListCreate ERROR'));
}

function deleteBlackList(req, res, next) {
  var ep = new EventProxy();
  var result = {};
  ep.all('data', function(data) {
    req.log.info('numberBlackListDestroy Success');
    result = util.parseJSON(data);
    res.json(result).end();
  });
  ep.fail(function(err,errMsg) {
    req.log.error(errMsg);
    res.json({err_code:'500', msg:err.msg || errMsg }).end();
  });
  apiBlackList.numberBlackListDestroy(req.body, util.done('data', ep, 'numberBlackListDestroy ERROR'));
}


exports.nbGet = nbGet;
exports.addBlacklistGet = addBlacklistGet;
exports.addBlacklistPost = addBlackListPost;
exports.deleteBlackList = deleteBlackList;