var request = require('request').defaults({
  strictSSL: false,
  rejectUnauthorized: false,
});
var serverAdd = require('../../config/serverAddress.js')
var util = require('./util');
//request = request.defaults({jar: true});
//var j = request.jar();


var option = {

  ip: serverAdd.pbx.ip,
  port: serverAdd.pbx.port,

  localhost: 'http://localhost:3000',


  trim: function (describe, paras) {
    var result = this.ip;
    if (this.port) {
      result += ':' + this.port;
    }
    if (describe) {
      result += describe + '?';
    }
    if (paras) {
      for (var o in paras) {
        result += o + '=' + encodeURIComponent(paras[o]) + '&';
      }
    }
    if (result.substr(result.length - 1) == '&' || result.substr(result.length - 1) == '?') {
      result = result.substr(0, result.length - 1);
    }
    return result;
  }

};
var option_voice_mail = {
  ip: serverAdd.vm.ip,
  port: serverAdd.vm.port,


  trim: function (describe, paras) {
    var result = this.ip;
    if (this.port) {
      result += ':' + this.port;
    }
    if (describe) {
      result += describe + '?';
    }
    if (paras) {
      for (var o in paras) {
        result += o + '=' + paras[o] + '&';
      }
    }
    if (result.substr(result.length - 1) == '&' || result.substr(result.length - 1) == '?') {
      result = result.substr(0, result.length - 1);
    }
    return result;
  }

};
var option_mcu = {

  ip: serverAdd.mcu.ip,
  port: serverAdd.mcu.port,

  trim: function (describe, paras, address) {
    var result = '';
    if(address && address.indexOf('127.0.0.1') === -1) {
      result = address;
    } else {
      result = this.ip;
      if (this.port) {
        result += ':' + this.port;
      }
    }
    if (describe) {
      result += describe + '?';
    }
    if (paras) {
      for (var o in paras) {
        result += o + '=' + paras[o] + '&';
      }
    }
    if (result.substr(result.length - 1) == '&' || result.substr(result.length - 1) == '?') {
      result = result.substr(0, result.length - 1);
    }
    return result;
  }

};
var option_ivr = {

  ip: serverAdd.ivr.ip,
  port: serverAdd.ivr.port,


  localhost: 'http://localhost:3000',


  trim: function (describe, paras) {
    var result = this.ip;
    if (this.port) {
      result += ':' + this.port;
    }
    if (describe) {
      result += describe + '?';
    }
    if (paras) {
      for (var o in paras) {
        result += o + '=' + paras[o] + '&';
      }
    }
    if (result.substr(result.length - 1) == '&' || result.substr(result.length - 1) == '?') {
      result = result.substr(0, result.length - 1);
    }
    return result;
  }

};
var option_ms = {

  ip: serverAdd.ms.ip,
  port: serverAdd.ms.port,

  trim: function (describe, paras, address) {
    var result = '';
    if(address) {
      result = address;
    } else {
      result = this.ip;
      if (this.port) {
        result += ':' + this.port;
      }
    }
    if (describe) {
      result += describe + '?';
    }

    if (paras) {
      for (var o in paras) {
        result += o + '=' + paras[o] + '&';
      }
    }
    if (result.substr(result.length - 1) == '&' || result.substr(result.length - 1) == '?') {
      result = result.substr(0, result.length - 1);
    }
    return result;
  }

};
var option_cq = {

  ip: serverAdd.cq.ip,
  port: serverAdd.cq.port,

  trim: function (describe, paras) {
    var result = this.ip;
    if (this.port) {
      result += ':' + this.port;
    }
    if (describe) {
      result += describe + '?';
    }
    if (paras) {
      for (var o in paras) {
        result += o + '=' + paras[o] + '&';
      }
    }
    if (result.substr(result.length - 1) == '&' || result.substr(result.length - 1) == '?') {
      result = result.substr(0, result.length - 1);
    }
    return result;
  }

};



exports.get = function (url, data, back) {

  //console.log(req.cookies);
  url = option.trim(url, data);

  //console.log(url);

  request.get(url, function (err, response, body) {
    console.log('PBX => GET => URL  = ' + url);
    console.log('PBX => GET => DATA = ' + body);
    if (typeof back === 'function') {
      back(err, body);
    }
  });

};
exports.post = function (url, data, back) {

  var options = {
    uri: option.trim(url),
    method: 'POST',
    json: data,
    timeout: 60000,
  };
  //console.log(options.uri);
  //console.log(options.json);
  request(options, function (err, response, body) {

    console.log('PBX => POST => URL  = ' + options.uri);
    console.log('PBX => POST => REQ => DATA = ' + JSON.stringify(options.json));
    console.log('PBX => POST => RES => DATA = ' + JSON.stringify(body));

    //console.log('POST : ' + typeof body == 'object' ? JSON.stringify(body) : body);
    if (!body) {
      if (response && response.statusCode == '200') {
        body = {
          result: 'success',
        }
      }
    }

    if (typeof back === 'function') {
      back(err, body);
    }
  });
};

exports.voiceMail = {
  get: function (url, data, back) {
    url = option_voice_mail.trim(url, data);

    console.log('VM => GET => URL  = ' + url);
    request.get(url, function (err, response, body) {
      console.log('VM => GET => DATA = ' + body);

      if (typeof back === 'function') {
        back(err, body);
      }
    });
  },
  post: function (url, data, back) {
    var options = {
      uri: option_voice_mail.trim(url),
      method: 'POST',
      json: data,
      timeout: 5000,
    };
    console.log('VM => POST => URL  = ' + options.uri);
    request(options, function (err, response, body) {

      console.log('VM => POST => REQ => DATA = ' + JSON.stringify(options.json));
      console.log('VM => POST => RES => DATA = ' + JSON.stringify(body));
      if (!body) {
        if (response && response.statusCode == '200') {
          body = {
            result: 'success',
          }
        }
      }

      if (typeof back === 'function') {
        back(err, body);
      }
    });
  }
};
exports.mcu = {
  get: function (url, data, back, address) {
    url = option_mcu.trim(url, data, address);

    console.log('MCU => GET => URL  = ' + url);

    request.get(url, function (err, response, body) {
      console.log('MCU => GET => DATA = ' + body);
      if (typeof back === 'function') {
        back(err, body);
      }
    });
  },
  post: function (url, data, back, address) {
    var options = {
      uri: option_mcu.trim(url, null, address),
      method: 'POST',
      json: data,
      timeout: 20000,
    };
    console.log('MCU => POST => URL  = ' + options.uri);
    console.log('MCU => POST => REQ => DATA = ' + JSON.stringify(options.json));
    request(options, function (err, response, body) {
      console.log('MCU => POST => RES => DATA = ' + JSON.stringify(body));
      if (!body) {
        if (response && response.statusCode == '200') {
          body = {
            result: 'success',
          }
        }
      }

      if (typeof back === 'function') {
        back(err, body);
      }
    });
  }
};
exports.ivr = {
  get: function (url, data, back) {
    url = option_ivr.trim(url, data);

    console.log('IVR => GET => URL  = ' + url);

    request.get(url, function (err, response, body) {
      console.log('IVR => GET => DATA = ' + body);
      if (typeof back === 'function') {
        back(err, body);
      }
    });
  },
  post: function (url, data, back) {
    var options = {
      uri: option_ivr.trim(url),
      method: 'POST',
      json: data,
      timeout: 20000,
    };
    console.log('IVR => POST => URL  = ' + options.uri);

    request(options, function (err, response, body) {

      console.log('IVR => POST => REQ => DATA = ' + JSON.stringify(options.json));
      console.log('IVR => POST => RES => DATA = ' + JSON.stringify(body));
      if (!body) {
        if (response && response.statusCode == '200') {
          body = {
            result: 'success',
          }
        }
      }

      if (typeof back === 'function') {
        back(err, body);
      }
    });
  }
};
exports.ms = {
  get: function (url, data, back, address) {
    url = option_ms.trim(url, data, address);

    console.log('MS => GET => URL  = ' + url);


    request.get(url, function (err, response, body) {
      console.log('MS => GET => DATA = ' + body);
      if (typeof back === 'function') {
        back(err, body);
      }
    });
  },
  post: function (url, data, back, address) {
    var options = {
      uri: option_ms.trim(url, null, address),
      method: 'POST',
      json: data,
      timeout: 20000,
    };
    console.log('MS => POST => URL  = ' + options.uri);

    request(options, function (err, response, body) {

      console.log('MS => POST => REQ => DATA = ' + JSON.stringify(options.json));
      console.log('MS => POST => RES => DATA = ' + JSON.stringify(body));
      if (!body) {
        if (response && response.statusCode == '200') {
          body = {
            result: 'success',
          }
        }
      }

      if (typeof back === 'function') {
        back(err, body);
      }
    });
  }
};
exports.cq = {
  get: function (url, data, back) {
    url = option_cq.trim(url, data);

    console.log('CQ => GET => URL  = ' + url);

    request.get(url, function (err, response, body) {
      console.log('CQ => GET => DATA = ' + body);
      if (typeof back === 'function') {
        back(err, body);
      }
    });
  },
  post: function (url, data, back) {
    var options = {
      uri: option_cq.trim(url),
      method: 'POST',
      json: data,
      timeout: 20000,
    };
    console.log('CQ => POST => URL  = ' + options.uri);

    request(options, function (err, response, body) {

      console.log('CQ => POST => REQ => DATA = ' + JSON.stringify(options.json));
      console.log('CQ => POST => RES => DATA = ' + JSON.stringify(body));
      if (!body) {
        if (response && response.statusCode == '200') {
          body = {
            result: 'success',
          }
        }
      }

      if (typeof back === 'function') {
        back(err, body);
      }
    });
  }
};

exports.local = {
  get: function (describe, req, back) {
    var url = option.localhost;
    //console.log(url+describe);
    //
    //
    //url += describe;
    //var myCookie = request.cookie('key='+req.cookies.key);
    //j.setCookie(myCookie, url);

    //request.cookie('key=' + req.cookies.key);

    url += describe;
    if (req.query) {
      url = util.trimGetParameter(url, req.query);
    }

    request.get(url, function (err, response, body) {
      //response.statusCode
      //此处是否处理status
      //...
      back(err, body);
    });
  },
  post: function (describe, data, back) {
    var url = option.localhost;
    data.local_token = 'abc';
    request.post(url + describe, {form: data, timeout: 30000}, function (err, response, body) {
      //response.statusCode
      //此处是否处理status
      //...

      back(body);
    });
  }
};