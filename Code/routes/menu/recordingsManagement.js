var emitter = require('../tool/emitter');
var util = require('../tool/util');
var EventProxy = require('eventproxy');
var proxy = new EventProxy();

var apiRecordings = require('../api/apiRecordings');


function recordingsGet(req, res, next) {


  var ep = new EventProxy();
  var result = {};
  result['rsData'] = {};
  ep.all('rsData', function (rsData) {
    result.rsData = util.parseJSON(rsData);

    var reqData = req.query;
    delete reqData.access_token;

    for(var o in reqData) {
      if(reqData[o]) {
        result[o] = reqData[o];
      }
    }

    console.log(result);
    res.render('solomon/recordingsManagement/rm', {data: result});
  });
  ep.fail(function (err, errMsg) {
    res.json({err_code: '500', msg: err.msg || errMsg}).end();
  });
  apiRecordings.recordingsList(req.query, util.done('rsData', ep, 'recordingsList ERROR'));

}
function recordingsDeletePost(req, res, next) {

  var ep = new EventProxy();
  var result = {};
  ep.all('data', function(data) {
    req.log.info('recordingsDestroy Success');
    result = util.parseJSON(data);
    res.json(result).end();
  });
  ep.fail(function(err,errMsg) {
    req.log.error(errMsg);
    res.json({err_code:'500', msg:err.msg || errMsg }).end();
  });
  apiRecordings.recordingsDestroy(req.body, util.done('data', ep, 'recordingsDestroy ERROR'));

}


exports.recordingsGet = recordingsGet;
exports.recordingsDeletePost = recordingsDeletePost;