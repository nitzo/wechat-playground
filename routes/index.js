var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  var url = 'http://' + req.host;
  //req.user = {
  //  name : 'Nitzo',
  //  email : 'nitzan@screemo.com'
  //};

  var user;

  if (req.user){
    user = JSON.stringify(req.user);
  }
  else if (req.headers['user-agent'] && /MicroMessenger/.test(req.headers['user-agent'])) {
    console.log('Wechat browser detected! AUTO-LOGIN!');
    passport.authenticate('wechat')(req, res, next);
  }


  res.render('index', { title: 'Express', user: user, url : url, wechat_config : JSON.stringify(wechat_config) });
});

module.exports = router;
