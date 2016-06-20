var emitter = require('../tool/emitter');
var util = require('../tool/util');
var EventProxy = require('eventproxy');
var proxy = new EventProxy();

var apiVirtualReceptionist = require('../api/apiVirtualReceptionist');
var apiExtensions = require('../api/apiExtensions');
var apiRingGroups = require('../api/apiRingGroups');
var apiCallQueue = require('../api/apiCallQueue');

var multiparty = require('multiparty');
var fs = require('fs');

function vrGet(req, res, next) {

  var ep = new EventProxy();
  var result = {};
  result['vrsData'] = {};
  ep.all('vrsData', function(vrsData) {
    result.vrsData = util.parseJSON(vrsData);
    console.log(result);
    res.render('solomon/content/virtualReceptionist/vr', {data: result});
  });
  ep.fail(function(err, errMsg) {
    res.json({err_code:'500', msg:err.msg || errMsg }).end();
  });
  apiVirtualReceptionist.virtualReceptionistList(req.query, util.done('vrsData', ep, 'VirtualReceptionistList ERROR'));
}
function virtualReceptionistList(req, res, next) {
  var ep = new EventProxy();
  ep.all('vrsData', function(vrsData) {
    res.json(util.parseJSON(vrsData)).end();
  });
  ep.fail(function(err, errMsg) {
    res.json({err_code:'500', msg:err.msg || errMsg }).end();
  });
  apiVirtualReceptionist.virtualReceptionistList(req.query, util.done('vrsData', ep, 'VirtualReceptionistList ERROR'));
}
function addVirtualReceptionistGet(req, res, next) {

  var ep = new EventProxy();
  var result = {};
  result['esData'] = {};
  result['rgsData'] = {};
  result['cqsData'] = {};
  result['vrsData'] = {};
  result['vrData'] = {};
  ep.all('esData', 'rgsData', 'cqsData', 'vrsData', function(esData, rgsData, cqsData, vrsData) {

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
    result.rgsData = util.parseJSON(rgsData);
    result.cqsData = util.parseJSON(cqsData);
    result.vrsData = util.parseJSON(vrsData);
    console.log(result);
    res.render('solomon/content/virtualReceptionist/addVirtualReceptionist', {type: 'add', data: result});
  });
  ep.fail(function(err, errMsg) {
    res.json({err_code:'500', msg:err.msg || errMsg }).end();
  });
  if(req.query && !req.query.cursor) {
    req.query.cursor = 1;
  }
  apiExtensions.extensionList(req.query, util.done('esData', ep, 'ExtensionList ERROR'));
  apiRingGroups.ringGroupsList(req.query, util.done('rgsData', ep, 'RingGroupsList ERROR'));
  apiCallQueue.callQueueList(req.query, util.done('cqsData', ep, 'CallQueueList ERROR'));
  apiVirtualReceptionist.virtualReceptionistList(req.query, util.done('vrsData', ep, 'VirtualReceptionistList ERROR'));



}
function addVirtualReceptionistPost(req, res, next) {

  var ep = new EventProxy();
  var result = {};
  ep.all('data', function(data) {
    req.log.info('VirtualReceptionistCreate Success');
    result = util.parseJSON(data);

    //if(result.virtual_receptionist_number && result.virtual_receptionist_password) {
    //  req.body.virtual_receptionist_number = result.virtual_receptionist_number;
    //  req.body.virtual_receptionist_password = result.virtual_receptionist_password;
    //  apiVirtualReceptionist.virtualReceptionistCreateIVR(req.body, function(err, data) {
    //    // ...
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
  apiVirtualReceptionist.virtualReceptionistCreate(req.body, util.done('data', ep, 'VirtualReceptionistCreate ERROR'));

}
function addVirtualReceptionistIVRPost(req, res, next) {
  var ep = new EventProxy();
  var result = {};
  ep.all('data', function(data) {
    result = util.parseJSON(data);
    res.json(result).end();
  });
  ep.fail(function(err,errMsg) {
    req.log.error(errMsg);
    res.json({err_code:'500', msg:err.msg || errMsg }).end();
  });
  apiVirtualReceptionist.virtualReceptionistCreateIVR(req.body, util.done('data', ep, 'virtualReceptionistCreateIVR ERROR'));
}
function updateVirtualReceptionistGet(req, res, next) {

  var ep = new EventProxy();
  var result = {};
  result['esData'] = {};
  result['rgsData'] = {};
  result['cqsData'] = {};
  result['vrsData'] = {};
  result['vrData'] = {};
  ep.all('esData', 'rgsData', 'cqsData', 'vrsData', 'vrData', function(esData, rgsData, cqsData, vrsData, vrData) {

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

    result.rgsData = util.parseJSON(rgsData);
    result.cqsData = util.parseJSON(cqsData);
    result.vrsData = util.parseJSON(vrsData);
    result.vrData = util.parseJSON(vrData);
    console.log(result);
    res.render('solomon/content/virtualReceptionist/addVirtualReceptionist', {type: 'update', data: result});
  });
  ep.fail(function(err, errMsg) {
    res.json({err_code:'500', msg:err.msg || errMsg }).end();
  });
  if(req.query && !req.query.cursor) {
    req.query.cursor = 1;
  }
  apiExtensions.extensionList(req.query, util.done('esData', ep, 'ExtensionList ERROR'));
  apiRingGroups.ringGroupsList(req.query, util.done('rgsData', ep, 'RingGroupsList ERROR'));
  apiCallQueue.callQueueList(req.query, util.done('cqsData', ep, 'CallQueueList ERROR'));
  apiVirtualReceptionist.virtualReceptionistList(req.query, util.done('vrsData', ep, 'VirtualReceptionistList ERROR'));
  apiVirtualReceptionist.virtualReceptionistShow(req.query, util.done('vrData', ep, 'VirtualReceptionistShow ERROR'));


}
function updateVirtualReceptionistPost(req, res, next) {
  var ep = new EventProxy();
  var result = {};
  ep.all('data', function(data) {
    req.log.info('VirtualReceptionistUpdate Success');
    result = util.parseJSON(data);

    //if(result.virtual_receptionist_number && result.virtual_receptionist_password) {
    //  req.body.virtual_receptionist_number = result.virtual_receptionist_number;
    //  req.body.virtual_receptionist_password = result.virtual_receptionist_password;
    //  apiVirtualReceptionist.virtualReceptionistUpdateIVR(req.body, function(err, data) {
    //    // ...
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
  apiVirtualReceptionist.virtualReceptionistUpdate(req.body, util.done('data', ep, 'VirtualReceptionistUpdate ERROR'));
}
function updateVirtualReceptionistIVRPost(req, res, next) {
  var ep = new EventProxy();
  var result = {};
  ep.all('data', function(data) {
    req.log.info('virtualReceptionistUpdateIVR Success');
    result = util.parseJSON(data);
    res.json(result).end();
  });
  ep.fail(function(err,errMsg) {
    req.log.error(errMsg);
    res.json({err_code:'500', msg:err.msg || errMsg }).end();
  });
  apiVirtualReceptionist.virtualReceptionistUpdateIVR(req.body, util.done('data', ep, 'virtualReceptionistUpdateIVR ERROR'));
}
function deleteVirtualReceptionistPost(req, res, next) {
  var ep = new EventProxy();
  var result = {};
  ep.all('data', function(data) {
    req.log.info('VirtualReceptionistDestroy Success');
    result = util.parseJSON(data);

    apiVirtualReceptionist.virtualReceptionistDestroyIVR(req.body, function(err, data) {
      // 忽略结果
    });

    res.json(result).end();
  });
  ep.fail(function(err,errMsg) {
    req.log.error(errMsg);
    res.json({err_code:'500', msg:err.msg || errMsg }).end();
  });
  apiVirtualReceptionist.virtualReceptionistDestroy(req.body, util.done('data', ep, 'VirtualReceptionistDestroy ERROR'));
}

function uploadPromptFile(req, res, next) {
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
      var dstPath = '../../Data/Media/' + fileName;

      fs.rename(uploadedPath, dstPath, function(err) {
        if(err){
          console.log('rename error: ' + err);
        } else {
          res.json({result: 'success', prompt_diskname: fileName, prompt: inputFile.originalFilename}).end();
        }
      });
    }
  });
}


exports.vrGet = vrGet;
exports.virtualReceptionistList = virtualReceptionistList;
exports.addVirtualReceptionistGet = addVirtualReceptionistGet;
exports.addVirtualReceptionistPost = addVirtualReceptionistPost;
exports.addVirtualReceptionistIVRPost = addVirtualReceptionistIVRPost;
exports.updateVirtualReceptionistGet = updateVirtualReceptionistGet;
exports.updateVirtualReceptionistPost = updateVirtualReceptionistPost;
exports.updateVirtualReceptionistIVRPost = updateVirtualReceptionistIVRPost;
exports.deleteVirtualReceptionistPost = deleteVirtualReceptionistPost;
exports.uploadPromptFile = uploadPromptFile;