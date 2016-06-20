var fs = require('fs');
var util = require('../tool/util');
var EventProxy = require('eventproxy');

var apiVoiceMail = require('../api/apiVoiceMail');



function vmGet(req, res, next) {


  var ep = new EventProxy();
  var result = {};
  result['vmData'] = {};

  ep.all('vmData', function(vmData) {
    result.vmData = util.parseJSON(vmData);

    req.log.info('voiceMailShow SUCCESS');
    req.log.info(JSON.stringify(result));

    res.render('solomon/content/voiceMain/vm', {data: result});
  });
  ep.fail(function(err, msg) {
    req.log.error('ProvidersList ERROR');
    req.log.error(msg);
    res.json({err_code:'500', msg:err.msg || msg });
  });
  apiVoiceMail.voiceMailShow(req.query, util.done('vmData', ep, 'voiceMailShow ERROR'));

}

function vmShowGet(req, res, next) {

  var ep = new EventProxy();
  var result = {};
  ep.all('vmData', function(vmData) {
    result.vmData =util.parseJSON(vmData);
    var vmHTML = fs.readFileSync('views/solomon/content/extensions/addExtensionVoiceMail.html', 'utf-8' );
    var vmFileHTML = fs.readFileSync('views/solomon/content/extensions/addExtensionVoiceMailFile.html', 'utf-8' );
    result.vmHTML = vmHTML;
    result.vmFileHTML = vmFileHTML;
    res.json(result).end();
  });
  ep.fail(function(err, msg) {
    req.log.error('ProvidersList ERROR');
    req.log.error(msg);
    res.json({err_code:'500', msg:err.msg || msg });
  });
  apiVoiceMail.extensionShow(req.query, util.done('vmData', ep, 'voiceMailShow ERROR'));
}
function vmGRTFListGet(req, res, next) {
  var ep = new EventProxy();
  ep.all('gfsData', function(gfsData) {
    res.json(util.parseJSON(gfsData)).end();
  });
  ep.fail(function(err, msg) {
    req.log.error('ProvidersList ERROR');
    req.log.error(msg);
    res.json({err_code:'500', msg:err.msg || msg });
  });
  apiVoiceMail.greetingFileList(req.query, util.done('gfsData', ep, 'greetingFileList ERROR'));
}

function vmUpdate(req, res, next) {
  var ep = new EventProxy();
  var result = {};
  ep.all('data', function(data) {

    apiVoiceMail.voiceMailUpdateVM(req.body, function(err, data) {
      //...
    })
    req.log.info('InboundRulesUpdate Success');
    result = util.parseJSON(data);
    res.json(result).end();
  });
  ep.fail(function(err,errMsg) {
    req.log.error(errMsg);
    res.json({err_code:'500', msg:err.msg || errMsg }).end();
  });
  apiVoiceMail.voiceMailUpdate(req.body, util.done('data', ep, 'InboundRulesUpdate ERROR'));
}


function vmCraete(req, res, next) {
  var ep = new EventProxy();
  var result = {};
  ep.all('data', function(data) {
    req.log.info('greetingFileCreate Success');
    result = util.parseJSON(data);
    res.json(result).end();
  });
  ep.fail(function(err,errMsg) {
    req.log.error(errMsg);
    res.json({err_code:'500', msg:err.msg || errMsg }).end();
  });
  apiVoiceMail.greetingFileCreate(req.body, util.done('data', ep, 'greetingFileCreate ERROR'));
}


exports.vmGet = vmGet;
exports.vmGRTFListGet = vmGRTFListGet;
exports.vmUpdate = vmUpdate;
exports.vmCraete = vmCraete;
exports.vmShowGet = vmShowGet;