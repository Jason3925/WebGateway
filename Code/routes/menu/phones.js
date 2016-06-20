var apiPhones = require('../api/apiPhones');
var util = require('../tool/util');

exports.phonesGet = function (req, res, next) {


  apiPhones.phonesListGet(req.query, function(err ,data) {

    var resJSON = data && util.parseJSON(data) || {};
    if(err) {
      resJSON.err_code = '500';
      resJSON.msg = 'PhonesList ERROR';
    }
    res.render('solomon/content/phones/phones', {data: resJSON});
  });

};