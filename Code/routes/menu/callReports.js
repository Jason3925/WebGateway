var emitter = require('../tool/emitter');
var util = require('../tool/util');
var EventProxy = require('eventproxy');
var proxy = new EventProxy();
var fs = require('fs');

var apiCallReports = require('../api/apiCallReports');

function crGet(req, res, next) {

  //emitter.local.get('/api/call_reports/list', req, function (data) {
  //
  //  console.log('============');
  //  console.log(data);
  //
  //  res.render('solomon/callReports/cr', {crData: JSON.parse(data)});
  //
  //});
  // if (req.query && req.query.page) {
  //   req.query.start_position = req.query.page * 20 - 20 + 1;
  //   req.query.end_position = req.query.page * 20;
  // }

  var cur_page = req.query.page;
  var ep = new EventProxy();
  var result = {};
  result['crsData'] = {};
  ep.all('crsData', function (crsData) {
    result.crsData = util.parseJSON(crsData);
    result.page = cur_page;
    result.page_size = 20;

    console.log(result);
    res.render('solomon/callReports/cr', {data: result});
  });
  ep.fail(function (err, errMsg) {
    res.json({err_code: '500', msg: err.msg || errMsg}).end();
  });
  cur_page = cur_page || 1;
  req.query.start_position = parseInt(cur_page) * 20 - 20 + 1;
  req.query.end_position = parseInt(cur_page) * 20;
  delete req.query.page;
  apiCallReports.callReportsList(req.query, util.done('crsData', ep, 'recordingsList ERROR'));


  //res.render('solomon/callReports/cr');

}
function crShowGet(req, res, next) {

  apiCallReports.callReportsShow(req.query, function (err, data) {
    var resJSON = {};
    resJSON.crData = util.parseJSON(data);
    resJSON.modelHTML = fs.readFileSync('views/solomon/callReports/modelDetailForm.html', 'utf-8');
    if(err) resJSON = {err_code: err.err_code||500, msg: err.msg||'CallReports Show ERROR'};
    res.json(resJSON).end();
  });
}
function searchGet(req, res, next) {

  res.render('solomon/callReports/searchDetail');

}

function searchPost(req, res, next) {

  var ep = new EventProxy();
  var result = {};
  ep.all('crData', function(crData) {
    result['crData'] = crData;
    res.json(result).end();
  });
  ep.fail(function(err, msg) {
    result['err_code'] = '500';
    result['msg'] = err.msg || msg;
    res.json(result).end();
  });
  apiCallReports.callReportsSearch(req.body, util.done('crData', ep, 'callRepostsSearch ERROR', res));
}

function downloadGet(req, res, next) {

  res.render('solomon/callReports/downloadOption');

}


exports.crGet = crGet;
exports.crShowGet = crShowGet;
exports.searchGet = searchGet;
exports.searchPost = searchPost;
exports.downloadGet = downloadGet;