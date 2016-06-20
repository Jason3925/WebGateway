var util = require('../tool/util');
var EventProxy = require('eventproxy');
var proxy = new EventProxy();



var apiSettings = require('../api/apiSettings.js');

function settingGet(req, res, next) {

  var ep = new EventProxy();
  var result = {};
  result['ssData'] = {};
  ep.all('ssData', function(ssData) {
    result.ssData = util.parseJSON(ssData);
    console.log(result);
    res.render('solomon/settings/settings', {data: result});
  });
  ep.fail(function(err, errMsg) {
    res.json({err_code:'500', msg:err.msg || errMsg }).end();
  });
  apiSettings.settingsShow(req.query, util.done('ssData', ep, 'settingsShow ERROR'));
  
  //res.render('solomon/settings/settings');

}

function settingWizardShow(req, res, next) {
  var ep = new EventProxy();
  ep.all('ssData', function(ssData) {
    //res.render('solomon/settings/settings', {data: result});
    res.json(util.parseJSON(ssData)).end();
  });
  ep.fail(function(err, errMsg) {
    res.json({err_code:'500', msg:err.msg || errMsg }).end();
  });
  apiSettings.settingsWizardShow(req.query, util.done('ssData', ep, 'settingsShow ERROR'));
}

function settingWizardUpdate(req, res, next) {
  apiSettings.settingsWizardUpdate(req.body, function(err, data) {
    var result = { err_code: '500', msg: 'settingWizardUpdate ERROR'};
    if (!err) {
      res.json({}).end();
    }
  })
}

function settingUpdatePost(req, res, next) {
  var ep = new EventProxy();
  var result = {};
  ep.all('data', function(data) {
    req.log.info('settingsUpdate Success');
    result = util.parseJSON(data);
    res.json(result).end();
  });
  ep.fail(function(err,errMsg) {
    req.log.error(errMsg);
    res.json({err_code:'500', msg:err.msg || errMsg }).end();
  });
  apiSettings.settingsUpdate(req.body, util.done('data', ep, 'settingsUpdate ERROR'));
}


exports.settingGet = settingGet;
exports.settingWizardShow = settingWizardShow;
exports.settingUpdatePost = settingUpdatePost;
exports.settingWizardUpdate = settingWizardUpdate;