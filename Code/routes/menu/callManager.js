var util = require('../tool/util')

var apiSummary = require('../api/apiSummary');

function cmiGet(req, res, next) {

  apiSummary.summaryShow(req.query, function(err ,data) {
    var resJSON = util.parseJSON(data);
    if (err) {
      resJSON = {err_code: err.err_code || 500, msg: err.msg || 'SummaryShow ERROR'}
    }
    console.log(resJSON);
    res.render('solomon/summary/summary', {data: resJSON});
  });
  
}


exports.cmiGet = cmiGet;