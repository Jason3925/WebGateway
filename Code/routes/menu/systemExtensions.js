var emitter = require('../tool/emitter');
var util = require('../tool/util');
var EventProxy = require('eventproxy');

var apiSystemExtensions = require('../api/apiSystemExtensions');

function sexGet(req, res, next) {


  var ep = new EventProxy();
  var result = {};
  result['seData'] = {};
  ep.all('seData', function(seData) {
    result.seData = util.parseJSON(seData);

    //页码
    var pageData = result.seData;
    if(pageData.start_position && pageData.end_position && pageData.remaining_extensions >= 0) {
      var start = pageData.start_position;
      var end = pageData.end_position;
      var sum = pageData.remaining_extensions;
      result.page = Math.ceil(end / (end - start + 1)); //当前页
      result.page_sum = result.page + Math.ceil(sum / (end - start + 1)); //总页
    }

    res.render('solomon/content/systemExtensions/sex', {data: result});
  });
  ep.fail(function(err, errMsg) {
    res.json({err_code:'500', msg:err.msg || msg });
  });
  apiSystemExtensions.systemExtensionsList(req.query, util.done('seData', ep, 'SystemExtensionsList ERROR'));

}


exports.sexGet = sexGet;