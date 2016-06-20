var emitter = require('../tool/emitter');
var util = require('../tool/util');
var EventProxy = require('eventproxy');
var proxy = new EventProxy();

var apiRingGroups = require('../api/apiRingGroups');
var apiExtensions = require('../api/apiExtensions');
var apiVirtualReceptionist = require('../api/apiVirtualReceptionist');


function rgGet(req, res, next) {



  var ep = new EventProxy();
  var result = {};
  result['rgsData'] = {};
  ep.all('rgsData', function(rgsData) {
    result.rgsData = util.parseJSON(rgsData);
    console.log(result);
    res.render('solomon/content/ringGroups/rg', {data: result});
  });
  ep.fail(function(err, errMsg) {
    res.json({err_code:'500', msg:err.msg || errMsg }).end();
  });
  apiRingGroups.ringGroupsList(req.query, util.done('rgsData', ep, 'RingGroupsList ERROR'));

}
function ringGroupsList(req, res, next) {
  var ep = new EventProxy();
  ep.all('rgsData', function(rgsData) {
    res.json(util.parseJSON(rgsData)).end();
  });
  ep.fail(function(err, errMsg) {
    res.json({err_code:'500', msg:err.msg || errMsg }).end();
  });
  apiRingGroups.ringGroupsList(req.query, util.done('rgsData', ep, 'ringGroupsList ERROR'));
}
function addRingGroupGet(req, res, next) {

  var ep = new EventProxy();
  var result = {};
  result['esData'] = {};
  result['vrsData'] = {};
  result['rgData'] = {};
  ep.all('esData', 'vrsData', 'rgsData', function(esData, vrsData, rgsData) {
    result.esData = util.parseJSON(esData);
    //页码
    var pageData = result.esData;
    if(pageData.start_position && pageData.end_position && pageData.remaining_extensions >= 0) {
      var start = pageData.start_position;
      var end = pageData.end_position;
      var sum = pageData.remaining_extensions;
      result.esData.page = Math.ceil(end / (end - start + 1)); //当前页
      result.esData.page_sum = result.esData.page + Math.ceil(sum / (end - start + 1)); //总页
    }
    //result.esData = util.parseJSON(orsData);
    result.vrsData = util.parseJSON(vrsData);
    result.rgsData = util.parseJSON(rgsData);
    res.render('solomon/content/ringGroups/addRingGroup', {type: 'add',data: result});
  });
  ep.fail(function(err, errMsg) {
    res.json({err_code:'500', msg:err.msg || errMsg }).end();
  });
  apiExtensions.extensionList(req.query, util.done('esData', ep, 'ExtensionsList ERROR'));
  apiVirtualReceptionist.virtualReceptionistList(req.query, util.done('vrsData', ep, 'VirtualReceptionistList ERROR'));
  apiRingGroups.ringGroupsList(req.query, util.done('rgsData', ep, 'ringGroupsList ERROR'));



}
function addRingGroupPost(req, res, next) {

  var ep = new EventProxy();
  var result = {};
  ep.all('data', function(data) {
    req.log.info('OutboundRulesCreate Success');
    result = util.parseJSON(data);
    res.json(result).end();
  });
  ep.fail(function(err,errMsg) {
    req.log.error(errMsg);
    res.json({err_code:'500', msg:err.msg || errMsg }).end();
  });
  apiRingGroups.ringGroupsCreate(req.body, util.done('data', ep, 'ringGroupsCreate ERROR'));

}

function updateRingGroupGet(req, res, next) {

  var ep = new EventProxy();
  var result = {};
  result['esData'] = {};
  result['vrsData'] = {};
  result['rgsData'] = {};
  result['rgData'] = {};
  ep.all('esData', 'vrsData', 'rgData', 'rgsData', function(esData, vrsData, rgData, rgsData) {

    result.esData = util.parseJSON(esData);
    //页码
    var pageData = result.esData;
    if(pageData.start_position && pageData.end_position && pageData.remaining_extensions >= 0) {
      var start = pageData.start_position;
      var end = pageData.end_position;
      var sum = pageData.remaining_extensions;
      result.esData.page = Math.ceil(end / (end - start + 1)); //当前页
      result.esData.page_sum = result.esData.page + Math.ceil(sum / (end - start + 1)); //总页
    }

    //result.esData = util.parseJSON(esData);
    result.vrsData = util.parseJSON(vrsData);
    result.rgsData = util.parseJSON(rgsData);
    result.rgData = util.parseJSON(rgData);
    console.log(result);
    res.render('solomon/content/ringGroups/addRingGroup', {type: 'add',data: result});
  });
  ep.fail(function(err, errMsg) {
    res.json({err_code:'500', msg:err.msg || errMsg }).end();
  });
  req.query.cursor = req.query.cursor || 1;
  apiExtensions.extensionList(req.query, util.done('esData', ep, 'ExtensionsList ERROR'));
  apiVirtualReceptionist.virtualReceptionistList(req.query, util.done('vrsData', ep, 'VirtualReceptionistList ERROR'));
  apiRingGroups.ringGroupsShow(req.query, util.done('rgData', ep, 'RingGroupsShow ERROR'));
  apiRingGroups.ringGroupsList(req.query, util.done('rgsData', ep, 'ringGroupsList ERROR'));

}

function updateRingGroupPost(req, res, next) {

  var ep = new EventProxy();
  var result = {};
  ep.all('data', function(data) {
    req.log.info('OutboundRulesUpdate Success');
    result = util.parseJSON(data);
    res.json(result).end();
  });
  ep.fail(function(err,errMsg) {
    req.log.error(errMsg);
    res.json({err_code:'500', msg:err.msg || errMsg }).end();
  });
  apiRingGroups.ringGroupsUpdate(req.body, util.done('data', ep, 'ringGroupsUpdate ERROR'));
}

function deleteRingGroupPost(req, res, next) {
  var ep = new EventProxy();
  var result = {};
  ep.all('data', function(data) {
    req.log.info('OutboundRulesUpdate Success');
    result = util.parseJSON(data);
    res.json(result).end();
  });
  ep.fail(function(err,errMsg) {
    req.log.error(errMsg);
    res.json({err_code:'500', msg:err.msg || errMsg }).end();
  });
  apiRingGroups.ringGroupsDestroy(req.body, util.done('data', ep, 'ringGroupsUpdate ERROR'));
}


exports.rgGet = rgGet;
exports.ringGroupsList = ringGroupsList;
exports.addRingGroupGet = addRingGroupGet;
exports.updateRingGroupGet = updateRingGroupGet;
exports.addRingGroupPost = addRingGroupPost;
exports.updateRingGroupPost = updateRingGroupPost;
exports.deleteRingGroupPost = deleteRingGroupPost;
