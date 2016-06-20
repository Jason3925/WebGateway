
var util = require('../tool/util');
var EventProxy = require('eventproxy');
var proxy = new EventProxy();

var apiServersStatus = require('../api/apiServersStatus');
var apiLogin = require('../api/apiLogin');

function ssGet(req, res, next) {

  var ep = new EventProxy();
  var result = {};
  result['sssData'] = {};

  ep.all('sssData', function(sssData) {
    result.sssData = util.parseJSON(sssData);

    req.log.info('serversStatus SUCCESS');
    req.log.info(JSON.stringify(result));

    res.render('solomon/settings/servicesStatus/ss', {data: result});
  });
  ep.fail(function(err, msg) {
    req.log.error('ProvidersList ERROR');
    req.log.error(msg);
    res.json({err_code:'500', msg:err.msg || msg });
  });
  apiServersStatus.servicesStatus(req.query, util.done('sssData', ep, 'serversStatus ERROR'));
  
  

}

function servicesStatusUpdatePost (req, res, next) {

  apiLogin.tokenRefresh(req.body, function(err, data) {
    if (err) {
      res.json({err_code: 500, msg: 'Authentication token failure'}).end();
      return;
    }
    if (data && data.expires) {
      var ep = new EventProxy();
      var result = {};
      ep.all('data', function(data) {
        req.log.info('serversUpdate Success');
        result = util.parseJSON(data);
        res.json(result).end();
      });
      ep.fail(function(err,errMsg) {
        req.log.error(errMsg);
        res.json({err_code:'500', msg:err.msg || errMsg }).end();
      });
      apiServersStatus.servicesUpdate(req.body, util.done('data', ep, 'serversUpdate ERROR'));
    }else {
      res.json({err_code: 500, msg: 'Authentication token failure'}).end();
    }
  });
}


exports.ssGet = ssGet;
exports.servicesStatusUpdatePost = servicesStatusUpdatePost;