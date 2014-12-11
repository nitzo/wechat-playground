
var wechat = require('wechat');

exports.wechatMiddleware = wechat('nitzo', function (req, res, next) {
    // message is located in req.weixin
    var message = req.weixin;

    res.send(JSON.stringify(message));


});

exports.requestLogger = function(req, res, next) {
    console.log('Req PATH=' + req.path + '\tReq body=' + JSON.stringify(req.body));
    next();
};
