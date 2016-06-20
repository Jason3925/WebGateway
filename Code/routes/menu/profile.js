var apiTenant = require('../api/apiTenant');
var util = require('../tool/util');
var EventProxy = require('eventproxy');

function profileGet(req, res, next) {

  req.query.username = req.session.mysession.username;
  var result = {};
  var ep = new EventProxy();
  ep.all('teData', function(teData) {
    result['teData'] = util.parseJSON(teData);

    console.log(result);
    res.render('solomon/profile/pf', {type: 'update', data: result});
  });
  ep.fail(function(err, errMsg) {
    result['err_code'] = err.msg || errMsg;
    res.json(result).end();
  });
  apiTenant.accountShow(req.query, util.done('teData', ep, 'accountShow ERROR'));

}


function profileUpdatePost(req, res, next) {
  var ep = new EventProxy();
  var result = {};
  ep.all('teData', function(teData) {
    result['teData'] = teData;
    res.json(result).end();
  });
  ep.fail(function(err, msg) {
    result['err_code'] = '500';
    result['msg'] = err.msg || msg;
    res.json(result).end();
  });
  apiTenant.accountUpdate(req.body, util.done('teData', ep, 'addTenantPost ERROR'));
}


exports.profileGet = profileGet;
exports.profileUpdatePost = profileUpdatePost;