
var moment = require('moment');


exports.initLocalFunction = function(app) {


  app.locals.trimValue = function (data, option, key) {
    //console.log(data+':'+option);
    var result = data;
    if (data && option) {
      if (typeof option.forEach == 'function') {
        option.forEach(function (para) {

          //&& result[para] != 'false'
          if (result[para] != undefined) {
            result = result[para];
          } else {
            result = '';
          }
        });
      }
    }
    if(result && result !='' && Array.isArray(result) && (key || key === 0)) {
      result = result[key];
    }
    return result;
  };
  app.locals.trimArray = function (data, option) {
    var result = [];
    if(data) {
      if (typeof data.forEach == 'function') {
        data.forEach(function(data, key) {
          if(option) {
            result[key] = data[option];
          }else {
            result[key] = data;
          }

        });
      }
    }
    return result;
  };
  app.locals.trimDate = function (data, option, fmt) {
    //console.log(data+':'+option);
    var result = data;
    if (data && option) {
      if (typeof option.forEach == 'function') {
        option.forEach(function (para) {

          //&& result[para] != 'false'
          if (result[para] != undefined) {
            result = result[para];
          } else {
            result = '';
          }
        });
      }
    }
    return moment(result * 1000).format(fmt);
  };
  app.locals.trimDateGap = function (data) {
    if (data > 0 ) {
      return moment.utc(data * 1000).format("HH:mm:ss");
    }else {
      return '0';
    }
    
  };
  app.locals.trimLook = function (role, status) {
    var result = false;
    if (Array.isArray(status) && status.length > 0) {
      if (status.filter(function(r) {
        return r === role;
      }).length > 0) {
        result = true;
      }
    }
    return result
  };


};