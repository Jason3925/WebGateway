var apiBilling = require('../api/apiBilling');
var util = require('../tool/util');

var EventProxy = require('eventproxy');



exports.billingGet = function (req, res, next) {

  var ep = new EventProxy();

  ep.all('bsData', function(bsData) {

    var result = {};
    result.bsData = util.parseJSON(bsData);
    res.render('solomon/billing/bi', {data: result});
  });

  ep.fail(function(err, msg) {
    console.log(err);
    res.json({err_code:'500', msg:err.msg || msg });
  });
  apiBilling.billingList(req.query, util.done('bsData', ep, 'billingList is ERROR'));
};


exports.billingAddGet = function (req, res, next) {
  res.render('solomon/billing/addBilling', {type: 'add', data: {}});
};
exports.billingAddPost = function (req, res, next) {
  var ep = new EventProxy();
  var result = {};
  ep.all('bData', function(bData) {
    result['bData'] = bData;
    res.json(result).end();
  });
  ep.fail(function(err, msg) {
    result['err_code'] = '500';
    result['msg'] = err.msg || msg;
    res.json(result).end();
  });

  apiBilling.billingCreate(req.body, util.done('bData', ep, 'billingCreate ERROR', res));
};


exports.billingUpdateGet = function (req, res, next) {
  var reqData = req.query;
  delete reqData.access_token;
  res.render('solomon/billing/addBilling', {type: 'update', data: {bData: reqData}});
};
exports.billingUpdatePost = function (req, res, next) {
  var ep = new EventProxy();
  var result = {};
  ep.all('bData', function(bData) {
    result['bData'] = bData;
    res.json(result).end();
  });
  ep.fail(function(err, msg) {
    result['err_code'] = '500';
    result['msg'] = err.msg || msg;
    res.json(result).end();
  });

  apiBilling.billingUpdate(req.body, util.done('bData', ep, 'billingUpdate ERROR', res));
};
exports.billingDestroyPost = function (req, res, next) {
  var ep = new EventProxy();
  var result = {};
  ep.all('bData', function(bData) {
    result['bData'] = bData;
    res.json(result).end();
  });
  ep.fail(function(err, msg) {
    result['err_code'] = '500';
    result['msg'] = err.msg || msg;
    res.json(result).end();
  });

  apiBilling.billingDestroy(req.body, util.done('bData', ep, 'billingDestroy ERROR', res));
};
