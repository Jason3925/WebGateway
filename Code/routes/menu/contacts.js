var util = require('../tool/util');
var EventProxy = require('eventproxy');

var apiContacts = require('../api/apiContacts');


exports.conGet = function (req, res, next) {

  var ep = new EventProxy();
  var result = {};
  result['cgsData'] = {};
  result['csData'] = {};
  ep.all('cgsData', function (cgsData) {
    req.log.info('contactsCreate Success');
    result.cgsData = util.parseJSON(cgsData);
    //res.json(result).end();

    if(req.query.group_id) {
      result.group_id = req.query.group_id
    }else {
      result.group_id = result.cgsData.groups[0].group_id;
      req.query.group_id = result.cgsData.groups[0].group_id;
    }

    apiContacts.contactsList(req.body, function (err, data) {
      if (err) {
        //,,,
        return;
      }
      result.csData = util.parseJSON(data);

      console.log(result);
      res.render('solomon/contacts/contacts', {data: result});
    });

  });
  ep.fail(function (err, errMsg) {
    req.log.error(errMsg);
    res.json({err_code: '500', msg: err.msg || errMsg}).end();
  });
  apiContacts.contactsGroupList(req.body, util.done('cgsData', ep, 'contactsGroupList ERROR'));

};

exports.addContactsGet = function (req, res, next) {

  var result = {};
  result.cData = {};


  res.render('solomon/contacts/addContacts', {type: 'add', data: result});


};

exports.addContactsPost = function (req, res, next) {

  var ep = new EventProxy();
  var result = {};
  ep.all('data', function (data) {
    req.log.info('contactsCreate Success');
    result = util.parseJSON(data);
    res.json(result).end();
  });
  ep.fail(function (err, errMsg) {
    req.log.error(errMsg);
    res.json({err_code: '500', msg: err.msg || errMsg}).end();
  });
  apiContacts.contactsCreate(req.body, util.done('data', ep, 'contactsCreate ERROR'));

};

exports.deleteContactsPost = function (req, res, next) {

  var ep = new EventProxy();
  var result = {};
  ep.all('data', function (data) {
    req.log.info('contactsDestroy Success');
    result = util.parseJSON(data);
    res.json(result).end();
  });
  ep.fail(function (err, errMsg) {
    req.log.error(errMsg);
    res.json({err_code: '500', msg: err.msg || errMsg}).end();
  });
  apiContacts.contactsDestroy(req.body, util.done('data', ep, 'contactsDestroy ERROR'));

};

exports.updateContactsGet = function (req, res, next) {
  var ep = new EventProxy();
  var result = {};
  result['cData'] = {};
  ep.all('cData', function (cData) {

    result.cData = util.parseJSON(cData);

    console.log(result);

    res.render('solomon/contacts/addContacts', {type: 'update', data: result});

  });
  ep.fail(function (err, errMsg) {
    req.log.error(errMsg);
    res.json({err_code: '500', msg: err.msg || errMsg}).end();
  });
  apiContacts.contactsShow(req.query, util.done('cData', ep, 'contactsShow ERROR'));
};

exports.updateContactsPost = function (req, res, next) {

  var ep = new EventProxy();
  var result = {};
  ep.all('data', function (data) {
    req.log.info('contactsUpdate Success');
    result = util.parseJSON(data);
    res.json(result).end();
  });
  ep.fail(function (err, errMsg) {
    req.log.error(errMsg);
    res.json({err_code: '500', msg: err.msg || errMsg}).end();
  });
  apiContacts.contactsUpdate(req.body, util.done('data', ep, 'contactsUpdate ERROR'));

};



exports.contactsGroup = function(req, res, next) {

  var ep = new EventProxy();
  var result = {};
  result['cgsData'] = {};

  ep.all('cgsData', function (cgsData) {
    req.log.info('contactsCreate Success');
    result.cgsData = util.parseJSON(cgsData);
    //res.json(result).end();

    res.render('solomon/contacts/groups', {data: result});

  });
  ep.fail(function (err, errMsg) {
    req.log.error(errMsg);
    res.json({err_code: '500', msg: err.msg || errMsg}).end();
  });
  apiContacts.contactsGroupList(req.body, util.done('cgsData', ep, 'contactsGroupList ERROR'));

};

exports.contactsGroupCreateGet = function(req, res, next) {

  res.render('solomon/contacts/addGroup', {type: 'add'});

};

exports.contactsGroupCreatePost = function(req, res, next) {

  var ep = new EventProxy();
  var result = {};
  ep.all('data', function (data) {
    req.log.info('contactsGroupCreate Success');
    result = util.parseJSON(data);
    res.json(result).end();
  });
  ep.fail(function (err, errMsg) {
    req.log.error(errMsg);
    res.json({err_code: '500', msg: err.msg || errMsg}).end();
  });
  apiContacts.contactsGroupCreate(req.body, util.done('data', ep, 'contactsGroupCreate ERROR'));

};

exports.contactsGroupDeletePost = function(req, res, next) {

  var ep = new EventProxy();
  var result = {};
  ep.all('data', function (data) {
    req.log.info('contactsGroupDestroy Success');
    result = util.parseJSON(data);
    res.json(result).end();
  });
  ep.fail(function (err, errMsg) {
    req.log.error(errMsg);
    res.json({err_code: '500', msg: err.msg || errMsg}).end();
  });
  apiContacts.contactsGroupDestroy(req.body, util.done('data', ep, 'contactsGroupDestroy ERROR'));

};

exports.contactsGroupUpdateGet = function(req, res, next) {

  res.render('solomon/contacts/addGroup', {type: 'update'});

};

exports.contactsGroupUpdatePost = function(req, res, next) {

  var ep = new EventProxy();
  var result = {};
  ep.all('data', function (data) {
    req.log.info('contactsGroupCreate Success');
    result = util.parseJSON(data);
    res.json(result).end();
  });
  ep.fail(function (err, errMsg) {
    req.log.error(errMsg);
    res.json({err_code: '500', msg: err.msg || errMsg}).end();
  });
  apiContacts.contactsGroupCreate(req.body, util.done('data', ep, 'contactsGroupCreate ERROR'));

};