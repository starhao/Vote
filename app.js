/**
 * Created by wuchenghao on 2017/4/26.
 */
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var uid_safe = require('uid-safe')
var port = process.env.PORT || '3000';

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('port', port);
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/resources', express.static(path.join(__dirname, 'resources')));

server.listen(app.get('port'), function () {
  console.log('listening:' + app.get('port'));
  if (process.env.NODE_ENV === 'development') {
    require('dong-node').startHttpProxy('vote', app.get('port'));
  }
});
var users = {};    //存储用户信息

//大屏幕显示的投票主页面
app.get('/', function (req, res) {
  res.render('index', getTotal())
});

//用户投票页面
app.get('/vote', async function (req, res) {
  if (!req.cookies.uid) {
    //该用户首次登陆
    //设置cookie , 过期时间5小时
    var uid = await uid_safe.sync(18);
    res.cookie("uid", uid, {maxAge: 5 * 60 * 60 * 1000});
    //首次进来初始化投票结果
    users[uid] = "";
  }
  console.log(users);
  res.render('vote', {statusOfVote: users[req.cookies.uid]});

});

//用户投票请求
app.post('/polling', function (req, res) {
  if (!req.cookies.uid) {
    res.send('cookie错误')
  } else {
    users[req.cookies.uid] = req.body.statusOfVote;
    io.emit('count', getTotal());
    res.send('success');
  }
});

//重置页面
app.get('/reset', function (req, res) {
  res.render('reset', {title: '重置'});
});

//重置票数
app.get('/resetCount', function (req, res) {
  users = {};
  io.emit('count', getTotal());
  res.send('重置成功')
});

io.on('connection', function (socket) {
  //有断开连接
  socket.on('disconnect', function () {
    console.log('disconnect')
  })
});


function getTotal() {
  var countOfA = 0, countOfB = 0;
  for (let key in users) {
    if (users[key] === "A") {
      countOfA++;
    } else if (users[key] === 'B') {
      countOfB++;
    }
  }
  return {countOfA, countOfB}
}

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
