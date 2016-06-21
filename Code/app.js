var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bunyan = require('bunyan');
var log = bunyan.createLogger(require('./bunyan-config.json').log);

var cookieParser = require('cookie-parser');

var bodyParser = require('body-parser');

var routes = require('./routes/index');
var api = require('./routes/indexAPI');


var look = require('./routes/filter/look');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');

//初始化模板方法
require('./config/localFunction').initLocalFunction(app);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(session({
  secret: 'mySession',
  resave: true,
  saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public')));


/**
 * 分页初始化数据处理
 */
app.use(function(req, res, next) {
  req.log = log;
  var pagesAPI = [
    '/callManager/extension',
    '/callManager/extension/list',
    '/callManager/inbound/create',
    '/callManager/ringGroups/ringGroup',
    '/callSessions',
  ];
  var curUrl = req.originalUrl;
  curUrl = curUrl.substr(0, curUrl.indexOf('?'));
  console.log('===========');
  console.log(curUrl);

  if (pagesAPI.filter(function(url) {
      return url === curUrl
    }).length > 0) {

    var reqJSON = req.method === 'GET' ? req.query : req.method === 'POST' ? req.body : {};
    reqJSON.page = reqJSON.page || 1;
    if (reqJSON.page) {
      var pageCount = 20;
      var pageStart = 1;
      var pageEnd = pageCount;
      var page = 1;
      if (reqJSON.pageCount) {
        pageCount = reqJSON.pageCount || pageCount;
      }
      if (reqJSON.page) {
        page = reqJSON.page || page;
      }
      pageStart = pageCount * (page - 1) + 1;
      pageEnd = pageStart + pageCount - 1;

      if (req.method === 'GET') {
        req.query.start_position = pageStart;
        req.query.end_position = pageEnd;
      }
      if (req.method === 'POST') {
        req.body.start_position = pageStart;
        req.body.end_position = pageEnd;
      }
    }
  }
  next();
});

/**
 * 加载权限过滤中间件
 */
app.use(look.look);


app.use('/', routes);
app.use('/api/', api);
//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    console.log('error');
    console.log('404');

    //res.redirect('/error');
    //res.status(err.status || 500);
    res.render('error/404');
    res.end();
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


/**
 * 启动
 */

log.info('开始执行启动脚本');
log.info('加载端口配置文件');
var addressConfig = require('./config/serverAddress');
var server = app.listen(addressConfig.httpConfig.httpPort, function() {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
  log.info('启动成功，地址为: http://%s:%s', host, port);
});

// try {
//   var https = require('https'),
//     fs = require("fs");

//   var options = {
//     key: fs.readFileSync('./../web_server.key'),
//     cert: fs.readFileSync('./../web_server.crt')
//   };

//   https.createServer(options, app).listen(addressConfig.httpConfig.httpsPort, function() {
//     console.log('Https server listening on port ' + 8887);
//   });
// } catch (err) {
//   console.log('Https Server Boot Failure : 8887');
//   // 屏蔽这个报错，以为会引起守护进程的判断，然后无限重启
//   // console.log(err);
// }



module.exports = app;