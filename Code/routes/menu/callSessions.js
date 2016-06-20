var emitter = require('../tool/emitter');
var util = require('../tool/util');
var EventProxy = require('eventproxy');
var proxy = new EventProxy();

var apiCallSessions = require('../api/apiCallSessions');
function csGet(req, res, next) {
  var ep = new EventProxy();
  var result = {};
  result['cssData'] = {};
  ep.all('cssData', function(cssData) {
    result.cssData = util.parseJSON(cssData);

    //页码
    var pageData = result.cssData;
    if(pageData.start_position && pageData.end_position && pageData.remaining_sessions >= 0) {
      var start = pageData.start_position;
      var end = pageData.end_position;
      var sum = pageData.remaining_sessions;
      result.page = Math.ceil(end / (end - start + 1)); //当前页
      result.page_sum = result.page + Math.ceil(sum / (end - start + 1)); //总页
    }

    res.render('solomon/callSessions/cs', {data: result});
  });
  ep.fail(function(err, errMsg) {
    res.json({err_code:'500', msg:err.msg || errMsg }).end();
  });
  if(req.query && !req.query.cursor) {
    req.query.cursor = 1;
  }
  apiCallSessions.callSessionList(req.query, util.done('cssData', ep, 'callSessionList ERROR'));
}

function csStopPost(req, res, next) {
  var ep = new EventProxy();
  var result = {};
  ep.all('data', function(data) {
    req.log.info('callSessionDestroy Success');
    result = util.parseJSON(data);
    res.json(result).end();
  });
  ep.fail(function(err,errMsg) {
    req.log.error(errMsg);
    res.json({err_code:'500', msg:err.msg || errMsg }).end();
  });
  apiCallSessions.callSessionDestroy(req.body, util.done('data', ep, 'callSessionDestroy ERROR'));
}


exports.csGet = csGet;
exports.csStopPost = csStopPost;