var emitter = require('../tool/emitter');
var util = require('../tool/util');
//var events = require('../tool/events');
var EventProxy = require('eventproxy');
var apiDomain = require('../api/apiDomain');
var apiTransports = require('../api/apiTransports');
var proxy = new EventProxy();

var multiparty = require('multiparty');
var fs = require('fs');

function dtGet(req, res, next) {

  var ep = new EventProxy();
  var result = {};
  result['dData'] = {};
  result['tData'] = {};
  ep.all('dData', 'tData', function(dData, tData) {
    result.dData = util.parseJSON(dData);
    result.tData = util.parseJSON(tData);
    console.log(result);
    res.render('solomon/content/domainsAndTransports/dat', {data: result});
  });
  ep.fail(function(err, errMsg) {
    res.json({err_code:'500', msg:err.msg || errMsg }).end();
  });
  apiDomain.domainShow(req.query, util.done('dData', ep, 'DomainShow ERROR'));
  apiTransports.transportsList(req.query, util.done('tData', ep, 'TransportsList ERROR'));

}

function domainShow(req, res, next) {
  apiDomain.domainShow(req.query, function(err, data) {
    var result = {};
    if (err) {
      result = {};
    }else {
      result = util.parseJSON(data);
    }
    res.json(result).end();
  });
}
function transportsList (req, res, next) {
  apiTransports.transportsList(req.query, function(err, data) {
    var result = {};
    if (err) {
      result = {};
    }else {
      result = util.parseJSON(data);
    }
    res.json(result).end();
  });
}
function updateDomainPost(req, res, next) {
  var ep = new EventProxy();
  var result = {};
  ep.all('data', function(data) {
    result = util.parseJSON(data);
    res.json(result).end();
  });
  ep.fail(function(err,errMsg) {
    res.json({err_code:'500', msg:err.msg || errMsg }).end();
  });
  apiDomain.domainUpdate(req.body, util.done('data', ep, 'updateDomainPost ERROR'));
}

function updateTransportsGet(req, res, next) {
  res.render('solomon/content/domainsAndTransports/addTransport');
}
function updateTransportsPost(req, res, next) {
  var ep = new EventProxy();
  var result = {};
  ep.all('data', function(data) {
    result = util.parseJSON(data);
    res.json(result).end();
  });
  ep.fail(function(err,errMsg) {
    res.json({err_code:'500', msg:err.msg || errMsg }).end();
  });

  //处理文件路径
  if(req.body) {
    var certificate_file = req.body.certificate_file;
    var private_key_file = req.body.private_key_file;
    var root_certificate_file = req.body.root_certificate_file;

    if(certificate_file) {
      certificate_file = certificate_file.substr(certificate_file.lastIndexOf('\\')+1);
    }
    if(private_key_file) {
      private_key_file = private_key_file.substr(private_key_file.lastIndexOf('\\')+1);
    }
    if(root_certificate_file) {
      root_certificate_file = root_certificate_file.substr(root_certificate_file.lastIndexOf('\\')+1);
    }

    req.body.certificate_file = certificate_file;
    req.body.private_key_file = private_key_file;
    req.body.root_certificate_file = root_certificate_file;

  }



  apiTransports.transportsCreate(req.body, util.done('data', ep, 'updateTransportsPost ERROR'));
}
function deleteTransportsPost(req, res, next) {
  var ep = new EventProxy();
  var result = {};
  ep.all('data', function(data) {
    result = util.parseJSON(data);
    res.json(result).end();
  });
  ep.fail(function(err,errMsg) {
    res.json({err_code:'500', msg:err.msg || errMsg }).end();
  });
  apiTransports.transportsDestroy(req.body, util.done('data', ep, 'transportsDestroy ERROR'));
}

function uploadCertificates(req, res, next) {
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
      var fileName = inputFile.originalFilename;
      var newPath = '../../Data/Certificates/';
      if (req.query && req.query.name && req.query.name === 'root') {
        newPath = '../../Data/Certificates/rootca/';
      }
      var dstPath = newPath + fileName;
      fs.rename(uploadedPath, dstPath, function(err) {
        if(err){
          console.log('rename error: ' + err);
        } else {
          res.json({result: 'success', fileName: inputFile.originalFilename}).end();
        }
      });
    }
  });
}


exports.dtGet = dtGet;
exports.domainShow = domainShow;
exports.transportsList = transportsList;
exports.updateDomainPost = updateDomainPost;
exports.updateTransportsGet = updateTransportsGet;
exports.updateTransportsPost = updateTransportsPost;
exports.deleteTransportsPost = deleteTransportsPost;
exports.uploadCertificates = uploadCertificates;