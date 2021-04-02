'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _nunjucks = require('nunjucks');

var _nunjucks2 = _interopRequireDefault(_nunjucks);

var _db = require('./../db/db');

var _db2 = _interopRequireDefault(_db);

var _body_parser = require('./../middle_wares/body_parser');

var _body_parser2 = _interopRequireDefault(_body_parser);

var _error_log = require('./../middle_wares/error_log');

var _error_log2 = _interopRequireDefault(_error_log);

var _login_pass = require('./../middle_wares/login_pass');

var _login_pass2 = _interopRequireDefault(_login_pass);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _index = require('./../routes/index');

var _index2 = _interopRequireDefault(_index);

var _appUser = require('./../routes/appUser');

var _appUser2 = _interopRequireDefault(_appUser);

var _cart = require('./../routes/cart');

var _cart2 = _interopRequireDefault(_cart);

var _address = require('./../routes/address');

var _address2 = _interopRequireDefault(_address);

var _order = require('./../routes/order');

var _order2 = _interopRequireDefault(_order);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 引入connect-mongo用于express连接数据库存储session
var mongoStore = require('connect-mongo')(_expressSession2.default);

// 3. 引入路由


// 引入express-session


var app = (0, _express2.default)();

// 6. 使用session
app.use((0, _expressSession2.default)({
    secret: _config2.default.secret,
    name: _config2.default.name,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: _config2.default.maxAge },
    rolling: true,
    store: new mongoStore({
        url: _config2.default.db_url,
        touchAfter: _config2.default.maxAge
    })
}));

// 1. 配置公共资源访问路径
app.use(_express2.default.static(_config2.default.publicPath));

// 2. 配置中间件（nunjucks模板引擎能够作用到views文件夹中的模板）
_nunjucks2.default.configure(_config2.default.viewsPath, {
    autoescape: true,
    express: app,
    noCache: true // 不使用缓存，模板每次都会重新编译
});

// 5. 配置数据处理的中间件
app.use(_body_parser2.default);

// 7. 配置后端拦截中间件
app.use(_login_pass2.default);

// 4. 挂载路由
app.use(_index2.default);
app.use(_appUser2.default);
app.use(_cart2.default);
app.use(_address2.default);
app.use(_order2.default);

// 5. 挂载错误中间件
app.use(_error_log2.default);

app.use(function (req, res) {
    res.render('404.html');
});

app.listen(_config2.default.port, function () {
    console.log('\u670D\u52A1\u5668\u5DF2\u7ECF\u542F\u52A8, \u7AEF\u53E3\u662F: ' + _config2.default.port);
});