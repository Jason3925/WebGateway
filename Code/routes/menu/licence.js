var util = require('../tool/util');
var EventProxy = require('eventproxy');
var proxy = new EventProxy();



var apiLicense = require('../api/apiLicense.js');

function licenceShow(req, res, next) {

  var ep = new EventProxy();
  var result = {};
  result['liData'] = {};
  ep.all('liData', function(liData) {
    result.liData = util.parseJSON(liData);
    console.log(result);
    res.render('solomon/settings/license/license', {data: result});
  });
  ep.fail(function(err, errMsg) {
    res.json({err_code:'500', msg:err.msg || errMsg }).end();
  });
  apiLicense.licenseShow(req.query, util.done('liData', ep, 'licenseShow ERROR'));

  //res.render('solomon/settings/settings');

}

function licenceUpdate(req, res, next) {
  var ep = new EventProxy();
  var result = {};
  ep.all('data', function(data) {
    req.log.info('licenseUpdate Success');
    result = util.parseJSON(data);
    res.json(result).end();
  });
  ep.fail(function(err,errMsg) {
    req.log.error(errMsg);
    res.json({err_code:'500', msg:err.msg || errMsg }).end();
  });
  apiLicense.licenseUpdate(req.body, util.done('data', ep, 'licenseUpdate ERROR'));
}


exports.licenceShow = licenceShow;
exports.licenceUpdate = licenceUpdate;