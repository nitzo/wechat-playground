var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var debug = require('debug')('wechat-playground');
var passport = require('passport');
var session = require('express-session');
var WechatStrategy = require('passport-wechat').Strategy;
var middleware = require('./middleware');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();




passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

wechat_config = {
    appID : 'wxceb0d1fdb505311d',
    appSecret : 'ad9c4b9ae80281ec0b7e85ff8116854c',
    //client : 'web',
    //appid: 'wxb8710554ac939ee2',
    //appsecret: '76dbfb00f17b71bb63ed22251ad34f89',
    callbackURL: 'http://wechat-playground.herokuapp.com/auth/wechat/callback',
    scope: 'snsapi_userinfo',
    state: true
    // appid: 'wx3af1ba5b6113419d',
    // appsecret: '74c7bf3702ff7d2cbc554ce19248a4b7',
    // callbackURL: 'http://api.liangyali.com:3000/auth/wechat/callback'
};


passport.use(new WechatStrategy(wechat_config , function (openid, profile, token, done) {
    console.log(openid);
    console.log(profile);
    console.log(token);
    return done(null, openid, profile);
}));



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: 'test'}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/', middleware.requestLogger);
//app.use('/wechat', middleware.wechatMiddleware)
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', function(req,res, next) {

    if (req.headers['user-agent'] && /MicroMessenger/.test(req.headers['user-agent'])) {
        console.log('Wechat browser detected! AUTO-LOGIN!');
        passport.authenticate('wechat')(req, res, next);
    }
    else {
        next();
    }


});

app.use('/', routes);
app.use('/users', users);

app.get('/auth/err', function (req, res) {
    res.send({message: 'error'});
});

app.get('/auth/success', function (req, res) {

    if (req.user) {
        res.json(req.user)
    }
    else {


        res.send({message: 'success'});
    }
});

//app.get('/', function (req, res) {
//    res.json({status: 'ok'});
//});

app.get('/auth/wechat', function(req,res, next){
    console.log(req.cookies);
    console.log(JSON.stringify(req.headers));

    passport.authenticate('wechat')(req,res,next);
});

app.get('/auth/wechat/callback', passport.authenticate('wechat', {
    failureRedirect: '/auth/err',
    successRedirect: '/'}));


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
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
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






app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
    debug('Express server listening on port ' + server.address().port);
});


module.exports = app;
