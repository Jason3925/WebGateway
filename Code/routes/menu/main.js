var request = require('request');
var util = require('../tool/util');

/**
 * MAIN GET function
 * show API PAGE
 */
function mainGet(req, res, next) {
  res.render('solomon/main/main');
}

function showNews(req, res, next) {
  request.get('http://www.portsip.com/news_gw.json', function(err, response, body) {
    var result = {};
    if (err) {
      result = {err: '400', msg: 'http://www.portsip.com/news_gw.json ERROR'};
    }else {
      result = util.parseJSON(body);
    }
    res.json(result).end();
  });
}

exports.mainGet = mainGet;
exports.showNews = showNews;