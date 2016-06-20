var fs = require('fs');
var xml2js = require('xml2js');
var emitter = require('../tool/emitter');
var util = require('../tool/util');
var apiExtensions = require('../api/apiExtensions');
var apiVoiceMail = require('../api/apiVoiceMail');
var EventProxy = require('eventproxy');

var multiparty = require('multiparty');
var fs = require('fs');

function exGet(req, res, next) {

  var ep = new EventProxy();
  var result = {};
  result['eData'] = {};
  ep.all('eData', function(eData) {
    result.eData = util.parseJSON(eData);

    //页码
    var pageData = result.eData;
    if(pageData.start_position && pageData.end_position && pageData.remaining_extensions >= 0) {
      var start = pageData.start_position;
      var end = pageData.end_position;
      var sum = pageData.remaining_extensions;
      result.page = Math.ceil(end / (end - start + 1)); //当前页
      result.page_sum = result.page + Math.ceil(sum / (end - start + 1)); //总页

      /**
       * 用于过滤extension权限下的extension列表
       */
      if (req.session.mysession.role === 'extension') {
        if (result.eData && result.eData.count > 0) {
          var cur_number = req.session.mysession.username;
          cur_number = cur_number.substr(0, cur_number.indexOf('@'));
          result.eData.extensions = result.eData.extensions.filter(function(extension) {
            return extension.extension_number == cur_number;
          })
        }
      }

    }

    res.render('solomon/content/extensions/ex', {data: result, role: req.session.mysession.role});
  });
  ep.fail(function(err, msg) {
    res.json({err_code:'500', msg:err.msg || msg });
  });
  //req.query.start_position = 1;
  //req.query.end_position = 5;
  apiExtensions.extensionList(req.query, util.done('eData', ep, 'Extensions ERROR'));

}
function extensionList(req, res, next) {

  var pageStr = fs.readFileSync('views/solomon/page.html', 'utf-8' );
  var ep = new EventProxy();
  ep.all('esData', function(esData) {
    esData.pageStr = pageStr;

    //页码
    var pageData = esData;
    if(pageData.start_position && pageData.end_position && pageData.remaining_extensions >= 0) {
      var start = pageData.start_position;
      var end = pageData.end_position;
      var sum = pageData.remaining_extensions;
      esData.page = Math.ceil(end / (end - start + 1)); //当前页
      esData.page_sum = esData.page + Math.ceil(sum / (end - start + 1)); //总页
    }

    res.json(util.parseJSON(esData)).end();
  });
  ep.fail(function(err, msg) {
    res.json({err_code:'500', msg:err.msg || msg });
  });
  //默认参数
  //req.query.start_position = 1;
  //req.query.end_position = 10;
  apiExtensions.extensionList(req.query, util.done('esData', ep, 'Extensions ERROR'));
}

function addExtensionsGet(req, res, next) {

  //var ep = new EventProxy();
  var result = {};
  result['eData'] = {};
  result['esData'] = {};
  result['rgData'] = {};
  result['vrsData'] = {};
  result['gfsData'] = {};


  if (req && req.query) {
    // PhoneProvisioning 默认值问题
    if (req.query.model && req.query.mac) {
      result.eData.phone_provisioning = {};
      result.eData.phone_provisioning.phone_model = req.query.model;
      result.eData.phone_provisioning.phone_mac_address = req.query.mac;
    }

  }

  res.render('solomon/content/extensions/addExtension', {type: 'add', data: result});
  //ep.all('esData', 'rgData', 'vrsData', function(esData, rgData, vrsData) {
  //  result.esData = util.parseJSON(esData);
  //  result.rgData = util.parseJSON(rgData);
  //  result.vrsData = util.parseJSON(vrsData);
  //  //result.gfsData = util.parseJSON(gfsData);
  //
  //  console.log(JSON.stringify(result));
  //  res.render('solomon/content/extensions/addExtension', {type: 'add', data: result});
  //});
  //ep.fail(function(err, msg) {
  //  res.json({err_code:'500', msg:err.msg || msg });
  //});
  ////默认参数
  //req.query.cursor = 1;
  //apiExtensions.extensionList(req.query, util.done('esData', ep, 'Extensions ERROR'));
  //apiRingGroups.ringGroupsList(req.query, util.done('rgData', ep, 'RingGroupsList ERROR'));
  //apiVirtualReceptionist.virtualReceptionistList(req.query, util.done('vrsData', ep, 'VirtualReceptionist ERROR'));
  //apiVoiceMail.greetingFileList(req.query, util.done('gfsData', ep, 'greetingFileList ERROR'));


  //res.render('solomon/content/extensions/addExtension', {type: 'add', data: ''});

}
function addExtensionsPost(req, res, next) {

  var ep = new EventProxy();
  var result = {};
  ep.all('data', function(data) {
    result = util.parseJSON(data);


    /**
     * pbx create 成功以后调用voice mail create
     */

    req.body.voice_mail = req.body.voice_mail || {};

    if(req.body.voice_mail) {
      apiVoiceMail.extensionCreate(req.body, function(err, body) {
        result.vm = 'error';
        if(err) {
          req.log.error('voiceMail create ERROR');
          res.json(result).end();
          return;
        }
        req.log.info('voiceMail create SUCCESS');
        req.log.info(body);
        result.vm = 'success';

        // 修改为等vm create 成功后返回成功信息
        res.json(result).end();

        //apiTransaction.transactionCommit(req.body, function(err,body) {
        //  if(err) {
        //    req.log.error('TransactionCommit ERROR');
        //    req.log.error(err);
        //    return;
        //  }
        //  req.log.info('TransactionCommit SUCCESS');
        //});

      });
    }

  });
  ep.fail(function(err,errMsg) {
    res.json({err_code:'500', msg:err.msg || errMsg }).end();
  });
  apiExtensions.extensionCreate(req.body, util.done('data', ep, 'ExtensionGroupCreate ERROR'));

}
function updateExtensionGet(req, res, next) {

  var ep = new EventProxy();
  var result = {};
  result['eData'] = {};
  result['esData'] = {};
  result['gfsData'] = {};
  result.eData['voice_mail'] = {};
  ep.all('eData', function(eData) {
    result.eData = util.parseJSON(eData);

    console.log(result);
    req.log.info('ExtensionShow Success');
    req.log.info(JSON.stringify(result));
    res.render('solomon/content/extensions/addExtension', {type: 'update', data: result});
  });
  ep.fail(function(err,errMsg) {
    req.log.error(errMsg);
    res.json({err_code:'500', msg:err.msg || errMsg }).end();
  });
  apiExtensions.extensionShow(req.query, util.done('eData', ep, 'PBX ExtensionShow ERROR'));


}
function updateExtensionPost(req, res, next) {
  var ep = new EventProxy();
  var result = {};
  ep.all('data', function(data) {
    result = util.parseJSON(data);
    result.vm = 'error';
    /**
     * PBX update 成功以后调用 voiceMail extensionUpdate 接口
     */
    req.log.info('ExtensionUpdate SUCCESS');
    req.body.voice_mail = req.body.voice_mail || {};
    if(req.body.voice_mail) {
      apiVoiceMail.extensionUpdate(req.body, function(err, body) {
        if(err) {
          req.log.error('VoiceMail ExtensionUpdate ERROR');
          res.json(result).end();
          return;
        }
        result.vm = 'success';
        res.json(result).end();
        req.log.info('VoiceMail ExtensionUpdate SUCCESS');
      });
    }


  });
  ep.fail(function(err,errMsg) {
    res.json({err_code:'500', msg:err.msg || errMsg }).end();
  });
  apiExtensions.extensionUpdate(req.body, util.done('data', ep, 'ExtensionUpdate ERROR'));
}
function deleteExtensionPost(req, res, next) {

  var ep = new EventProxy();
  var result = {};
  ep.all('data', function(data) {
    req.log.info('extensionDestroy SUCCESS');
    result = util.parseJSON(data);
    res.json(result).end();
    apiVoiceMail.extensionDestroy(req.body, function(err, data) {
      if(err) {
        req.log.error('VoiceMail ExtensionDestroy ERROR');
        return;
      }
      req.log.error('VoiceMail ExtensionDestroy SUCCESS');
    })
  });
  ep.fail(function(err,errMsg) {
    req.log.info('extensionDestroy ERROR');
    res.json({err_code:'500', msg:err.msg || errMsg }).end();
  });
  apiExtensions.extensionDestroy(req.body, util.done('data', ep, 'ExtensionUpdate ERROR'));
}

function getPhoneModelsGet(req, res, next) {
  var ep = new EventProxy();
  fs.readdir(__dirname + '/../tool/templates/phones/', function(err, fileNames) {
    if(fileNames && Array.isArray(fileNames)) {
      var models = {};
      ep.after('read_file', fileNames.length, function(data) {
        var result = {};
        result.models = data;
        console.log(result);
        res.json(result).end();
      });
      fileNames.map(function(fileName) {
        var parser = new xml2js.Parser();
        fs.readFile(__dirname + '/../tool/templates/phones/'+fileName, function(err, data) {
          parser.parseString(data, function(err, result) {
            var simpleName = fileName.substr(0, fileName.lastIndexOf('.'));
            var data = {};
            data[simpleName] = result;
            ep.emit('read_file', data);
          });
        });
      });
    }
  });
}


function extensionGroupGet(req, res, next) {

  var ep = new EventProxy();
  var result = {};
  result['egData'] = {};
  ep.all('egData', function(egData) {
    result.egData = util.parseJSON(egData);
    res.render('solomon/content/extensions/groupManagement/groupManagement', {data: result});
  });
  ep.fail(function(err, msg) {
    res.json({err_code:'500', msg:err.msg || msg }).end();
  });

  apiExtensions.extensionGroupList(req.query, util.done('egData', ep, 'ExtensionGroupGet ERROR'));

}
function addGroupGet(req, res, next) {


  var ep = new EventProxy();
  var result = {};
  result['eData'] = {};
  result['egData'] = {};
  ep.all('eData', function(eData) {
    result.eData = eData;
    res.render('solomon/content/extensions/groupManagement/addGroup', {type:'add', data: result});
  });
  ep.fail(function(err, errMsg) {
    res.json({err_code:'500', msg:err.msg || errMsg }).end();
  });
  //默认参数可能还需修改。临时直接赋值
  req.query.cursor = 1;
  apiExtensions.extensionList(req.query, util.done('eData', ep, 'ExtensionGroupList ERROR'));

}
function addGroupPost(req, res, next) {

  var ep = new EventProxy();
  var result = {};
  ep.all('data', function(data) {
    result = util.parseJSON(data);
    res.json(result).end();
  });
  ep.fail(function(err, errMSG) {
    res.json({err_code:'500', msg:err.msg || errMSG }).end();
  });
  apiExtensions.extensionGroupCreate(req.body, util.done('data', ep, 'AddExtensionGroupPOST ERROR'));


}
function updateGroupGet(req, res, next) {

  var ep = new EventProxy();
  var result = {};
  result['eData'] = {};
  result['egData'] = {};
  ep.all('eData', 'egData', function(eData, egData) {
    result.eData = util.parseJSON(eData);
    result.egData = util.parseJSON(egData);
    res.render('solomon/content/extensions/groupManagement/addGroup', {type:'update', data: result});
  });
  ep.fail(function(err, errMsg) {
    res.json({err_code:'500', msg:err.msg || errMsg }).end();
  });
  //默认参数可能还需修改。临时直接赋值
  req.query.cursor = 1;
  apiExtensions.extensionGroupShow(req.query, util.done('egData', ep, 'ExtensionGroupShow ERROR'));
  apiExtensions.extensionList(req.query, util.done('eData', ep, 'Extension ERROR'));

}
function updateGroupPost(req, res, next) {
  var ep = new EventProxy();
  var result = {};
  ep.all('data', function(data) {
    result = util.parseJSON(data);
    res.json(result).end();
  });
  ep.fail(function(err,errMsg) {
    res.json({err_code:'500', msg:err.msg || errMsg }).end();
  });
  apiExtensions.extensionGroupUpdate(req.body, util.done('data', ep, 'ExtensionGroupUpdate ERROR'));
}
function deleteGroupPost(req, res, next) {
  var ep = new EventProxy();
  var result = {};
  ep.all('data', function(data) {
    result = util.parseJSON(data);
    res.json(result).end();

  });
  ep.fail(function(err,errMsg) {
    res.json({err_code:'500', msg:err.msg || errMsg }).end();
  });
  apiExtensions.extensionGroupDestroy(req.body, util.done('data', ep, 'ExtensionGroupDestroy ERROR'));
}


function deleteGreetingFile(req, res, next) {
  var ep = new EventProxy();
  var result = {};
  ep.all('data', function(data) {
    req.log.info('greetingFileDestroy SUCCESS');
    result = util.parseJSON(data);
    res.json(result).end();
    //apiVoiceMail.extensionDestroy(req.body, function(err, data) {
    //  if(err) {
    //    req.log.error('greetingFileDestroy ERROR');
    //    return;
    //  }
    //  req.log.error('greetingFileDestroy SUCCESS');
    //})
  });
  ep.fail(function(err,errMsg) {
    req.log.info('extensionDestroy ERROR');
    res.json({err_code:'500', msg:err.msg || errMsg }).end();
  });
  apiVoiceMail.greetingFileDestroy(req.body, util.done('data', ep, 'greetingFileDestroy ERROR'));
}
function updateGreetingFile(req, res, next) {
  var ep = new EventProxy();
  var result = {};
  ep.all('data', function(data) {
    req.log.info('greetingFileUpdate SUCCESS');
    result = util.parseJSON(data);
    res.json(result).end();
    //apiVoiceMail.extensionDestroy(req.body, function(err, data) {
    //  if(err) {
    //    req.log.error('greetingFileUpdate ERROR');
    //    return;
    //  }
    //  req.log.error('greetingFileUpdate SUCCESS');
    //})
  });
  ep.fail(function(err,errMsg) {
    req.log.info('extensionDestroy ERROR');
    res.json({err_code:'500', msg:err.msg || errMsg }).end();
  });
  apiVoiceMail.greetingFileUpdate(req.body, util.done('data', ep, 'greetingFileUpdate ERROR'));
}

function uploadGreetingFile(req, res, next) {
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
      var fileName = uploadedPath.substr(uploadedPath.lastIndexOf('/')+1, uploadedPath.length);
      var dstPath = '../../Data/Voicemail/Greeting/' + fileName;
      fs.rename(uploadedPath, dstPath, function(err) {
        if(err){
          console.log('rename error: ' + err);
        } else {
          res.json({result: 'success', fileName: fileName, realFileName: inputFile.originalFilename}).end();
        }
      });
    }
  });


}
function importFile(req, res, next) {
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
      // var fileName = uploadedPath.substr(uploadedPath.lastIndexOf('/')+1, uploadedPath.length);
      var dstPath = '../../Data/' + inputFile.originalFilename;
      fs.rename(uploadedPath, dstPath, function(err) {
        if(err){
          console.log('rename error: ' + err);
        } else {
          // res.json({result: 'success', fileName: inputFile.originalFilename}).end();
          //  上传成功后调用PBX接口
          var reqJSON = {
            access_token: req.body.access_token,
            extensions_file_name: inputFile.originalFilename,
            tenantid : req.session.mysession.username
          };
          apiExtensions.extensionImport(reqJSON, function(err, data) {
            var resJSON = data;
            if(err) resJSON = { err_code: '400', msg: 'extensionImport ERROR' };
            res.json(resJSON).end();
          });

        }
      });
    }
  });
}
function exportFile(req, res, next) {
  var resJSON = {
    access_token: req.query.access_token,
    // tenantid : req.session.mysession.username,
  };
  apiExtensions.extensionExport(resJSON, function(err, data) {
    if (err) {
      res.json({err_code: 400, msg: 'extensionExport ERROR'}).end();
      return;
    }
    var file = data.extensions_file_path_name;
    res.download(file);
    
  });

}



exports.exGet = exGet;
exports.extensionListGet = extensionList;
exports.addExtensionsGet = addExtensionsGet;
exports.addExtensionsPost = addExtensionsPost;
exports.updateExtensionGet = updateExtensionGet;
exports.updateExtensionPost = updateExtensionPost;
exports.deleteExtensionPost = deleteExtensionPost;

exports.getPhoneModelsGet = getPhoneModelsGet;

exports.extensionGroupGet = extensionGroupGet;
exports.addGroupGet = addGroupGet;
exports.addGroupPost = addGroupPost;
exports.updateGroupGet = updateGroupGet;
exports.updateGroupPost = updateGroupPost;
exports.deleteGroupPost = deleteGroupPost;

exports.deleteGreetingFile = deleteGreetingFile;
exports.updateGreetingFile = updateGreetingFile;
exports.uploadGreetingFile = uploadGreetingFile;
exports.importFile = importFile;
exports.exportFile = exportFile;