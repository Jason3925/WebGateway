
exports.trimGetParameter = function (url, pars) {

  if (url && pars) {

    if (url.indexOf('?') < 0) {
      url += '?';
    } else {
      url += '&';
    }
    for (var o in pars) {
      url += o + '=' + pars[o] + '&';
    }
  }
  if (url.lastIndexOf('&') == (url.length - 1)) {
    url = url.substr(0, (url.length - 1));
  }

  return url;

};


function parseJSON (str) {
  var result = str;
  if(typeof str == 'string') {
    try {
      var result = {
        err_code: '500',
        msg: 'Abnormal returns the result format -- ' + str
      };
      if (str && str.indexOf('{') == 0 && str.lastIndexOf('}') == str.length - 1) {
        result = JSON.parse(str);
      }
    } catch(err) {
      return result;
    }
  }
  return result;
};

exports.done = function(name, proxy, errorMsg, res) {
  return function(err,data) {
    data = parseJSON(data);
    if(err) {
      proxy.emit('error', err, errorMsg);
      return;
    }
    if(data && data.err_code) {
      proxy.emit('error', data, errorMsg);
      return;
    }
    if(data && data.result == 'error') {
      proxy.emit('error', data, errorMsg);
      return;
    }
    /**
     * 应该还需优化一下这里的逻辑，避免未知的错误
     */
    if(data) {
      proxy.emit(name, data, res);
      return;
    }
  }
};

exports.extend = function (des, src, override) {
  if(src instanceof Array){
    for(var i = 0, len = src.length; i < len; i++)
      this.extend(des, src[i], override);
  }
  for( var i in src){
    if(override || !(i in des)){
      des[i] = src[i];
    }
  }
  return des;
};

exports.toLong = function(ip) {
  var ipl = 0;
  ip.split('.').forEach(function(octet) {
    ipl <<= 8;
    ipl += parseInt(octet);
  });
  return(ipl >>> 0);
};

exports.fromLong = function(ipl) {
  return ((ipl >>> 24) + '.' +
  (ipl >> 16 & 255) + '.' +
  (ipl >> 8 & 255) + '.' +
  (ipl & 255) );
};



exports.parseJSON = parseJSON;