var util = require('../tool/util');
var EventProxy = require('eventproxy');

var apiCallQueue = require('../api/apiCallQueue');
var apiExtensions = require('../api/apiExtensions');
var apiRingGroups = require('../api/apiRingGroups');
var apiVirtualReceptionist = require('../api/apiVirtualReceptionist');

var multiparty = require('multiparty');
var fs = require('fs');

function cqGet(req, res, next) {

  var ep = new EventProxy();
  var result = {};
  result['cqsData'] = {};
  ep.all('cqsData', function(cqsData) {
    result.cqsData = util.parseJSON(cqsData);

    req.log.info('ProvidersList SUCCESS');
    req.log.info(JSON.stringify(result));

    res.render('solomon/content/callQueue/cq', {data: result});
  });
  ep.fail(function(err, msg) {
    req.log.error('ProvidersList ERROR');
    req.log.error(msg);
    res.json({err_code:'500', msg:err.msg || msg });
  });
  apiCallQueue.callQueueList(req.query, util.done('cqsData', ep, 'CallQueueList ERROR'));

}
function addCallQueueGet(req, res, next) {

  var ep = new EventProxy();
  var result = {};
  result['esData'] = {};
  result['rgsData'] = {};
  result['vrsData'] = {};
  result['cqData'] = {};
  ep.all('esData', 'rgsData', 'vrsData', function(esData, rgsData, vrsData) {
    result.esData = util.parseJSON(esData);
    result.rgsData = util.parseJSON(rgsData);
    result.vrsData = util.parseJSON(vrsData);

    req.log.info('ProvidersList SUCCESS');
    req.log.info(JSON.stringify(result));

    res.render('solomon/content/callQueue/addCallQueue', {type: 'add',data: result});
  });
  ep.fail(function(err, msg) {
    req.log.error('ProvidersList ERROR');
    req.log.error(msg);
    res.json({err_code:'500', msg:err.msg || msg });
  });
  if(req.query && !req.query.cursor) {
    req.query.cursor = 1;
  }
  apiExtensions.extensionList(req.query, util.done('esData', ep, 'ExtensionList ERROR'));
  apiRingGroups.ringGroupsList(req.query, util.done('rgsData', ep, 'RingGroupsList ERROR'));
  apiVirtualReceptionist.virtualReceptionistList(req.query, util.done('vrsData', ep, 'VirtualReceptionistList ERROR'));


}
function addCallQueuePost(req, res, next) {
  var ep = new EventProxy();
  var result = {};
  ep.all('data', function(data) {
    req.log.info('CallQueueCreate Success');
    result = util.parseJSON(data);

    // PBX成功后把请求参数发往Callqueue
    //if(result.call_queue_password && result.ring_group_number) {
    //  req.body.call_queue_password = result.call_queue_password;
    //  req.body.ring_group_number = result.ring_group_number;
    //  apiCallQueue.callQueueCreateCallQueue(req.body, function(err, data) {
    //    // 这里不考虑成功与否
    //  });
    //}

    result = util.extend({}, [req.body, result]);
    delete result.access_token;

    res.json(result).end();
  });
  ep.fail(function(err,errMsg) {
    req.log.error(errMsg);
    res.json({err_code:'500', msg:err.msg || errMsg }).end();
  });
  apiCallQueue.callQueueCreate(req.body, util.done('data', ep, 'CallQueueCreate ERROR'));
}
function addCallQueuePostCQ(req, res, next) {
  var ep = new EventProxy();
  var result = {};
  ep.all('data', function(data) {
    req.log.info('CallQueueCreate Success');
    result = util.parseJSON(data);
    res.json(result).end();
  });
  ep.fail(function(err,errMsg) {
    req.log.error(errMsg);
    res.json({err_code:'500', msg:err.msg || errMsg }).end();
  });
  apiCallQueue.callQueueCreateCallQueue(req.body, util.done('data', ep, 'callQueueCreateCallQueue ERROR'));
}

function updateCallQueueGet(req, res, next) {

  var ep = new EventProxy();
  var result = {};
  result['esData'] = {};
  result['rgsData'] = {};
  result['vrsData'] = {};
  result['cqData'] = {};
  ep.all('esData', 'rgsData', 'vrsData', 'cqData', function(esData, rgsData, vrsData, cqData) {
    result.esData = util.parseJSON(esData);
    result.rgsData = util.parseJSON(rgsData);
    result.vrsData = util.parseJSON(vrsData);
    result.cqData = util.parseJSON(cqData);

    req.log.info('ProvidersList SUCCESS');
    //req.log.info(JSON.stringify(result));

    res.render('solomon/content/callQueue/addCallQueue', {type: 'add',data: result});
  });
  ep.fail(function(err, msg) {
    req.log.error('ProvidersList ERROR');
    req.log.error(msg);
    res.json({err_code:'500', msg:err.msg || msg });
  });
  if(req.query && !req.query.cursor) {
    req.query.cursor = 1;
  }

  apiExtensions.extensionList(req.query, util.done('esData', ep, 'ExtensionList ERROR'));
  apiRingGroups.ringGroupsList(req.query, util.done('rgsData', ep, 'RingGroupsList ERROR'));
  apiVirtualReceptionist.virtualReceptionistList(req.query, util.done('vrsData', ep, 'VirtualReceptionistList ERROR'));
  apiCallQueue.callQueueShow(req.query, util.done('cqData', ep, 'CallQueueShow ERROR'));





}
function updateCallQueuePost(req, res, next) {

  var ep = new EventProxy();
  var result = {};
  ep.all('data', function(data) {
    req.log.info('CallQueueUpdate Success');
    result = util.parseJSON(data);
    result = util.extend({}, [req.body, result]);
    delete result.access_token;
    res.json(result).end();
  });
  ep.fail(function(err,errMsg) {
    req.log.error(errMsg);
    res.json({err_code:'500', msg:err.msg || errMsg }).end();
  });
  apiCallQueue.callQueueUpdate(req.body, util.done('data', ep, 'CallQueueUpdate ERROR'));

}
function updateCallQueuePostCQ(req, res, next) {

  var ep = new EventProxy();
  var result = {};
  ep.all('data', function(data) {
    req.log.info('callQueueUpdateCallQueue Success');
    result = util.parseJSON(data);
    res.json(result).end();
  });
  ep.fail(function(err,errMsg) {
    req.log.error(errMsg);
    res.json({err_code:'500', msg:err.msg || errMsg }).end();
  });
  apiCallQueue.callQueueUpdateCallQueue(req.body, util.done('data', ep, 'callQueueUpdateCallQueue ERROR'));

}
function deleteCallQueuePost(req, res, next) {

  var ep = new EventProxy();
  var result = {};
  ep.all('data', function(data) {
    req.log.info('CallQueueDestroy Success');
    result = util.parseJSON(data);
    apiCallQueue.callQueueDestroyCallQueue(req.body, function(err, data) {
      // ...
    });
    res.json(result).end();
  });
  ep.fail(function(err,errMsg) {
    req.log.error(errMsg);
    res.json({err_code:'500', msg:err.msg || errMsg }).end();
  });
  apiCallQueue.callQueueDestroy(req.body, util.done('data', ep, 'CallQueueDestroy ERROR'));

}


function uploadCallQueuesFile(req, res, next) {
  var form = new multiparty.Form({uploadDir: './public/files'});
  form.parse(req, function(err, fields, files) {
    if (err) {
      console.log('upload is error');
    } else {
      var inputFile = '';
      for(var o in files) {
        inputFile = files[o][0];
        break;
      }
      var uploadedPath = inputFile.path.replace(/\\/g, '/');
      var fileName = uploadedPath.substr(uploadedPath.lastIndexOf('/') + 1, uploadedPath.length);
      var dstPath = '../../Data/CallQueue/' + fileName;


      fs.rename(uploadedPath, dstPath, function(err) {
        if(err){
          console.log('rename error: ' + err);
        } else {
          res.json({result: 'success', diskname: fileName, name: inputFile.originalFilename}).end();
        }
      });
    }
  });
}





exports.cqGet = cqGet;
exports.addCallQueueGet = addCallQueueGet;
exports.addCallQueuePost = addCallQueuePost;
exports.addCallQueuePostCQ = addCallQueuePostCQ;
exports.updateCallQueueGet = updateCallQueueGet;
exports.updateCallQueuePost = updateCallQueuePost;
exports.updateCallQueuePostCQ = updateCallQueuePostCQ;
exports.deleteCallQueuePost = deleteCallQueuePost;
exports.uploadCallQueuesFile = uploadCallQueuesFile;