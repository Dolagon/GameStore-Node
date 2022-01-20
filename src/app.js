import express from 'express';
import config from './config';
import nunjucks from 'nunjucks';

import bodyParser from './../middle_wares/body_parser';
import errorLog from './../middle_wares/error_log';
import loginPass from './../middle_wares/login_pass';

// 引入express-session
import session from 'express-session';
// 引入connect-mongo用于express连接数据库存储session
const mongoStore = require('connect-mongo')(session);

// 3. 引入路由
import indexRouter from './../routes/index';
import appUserRouter from './../routes/appUser';
import cartRouter from './../routes/cart';
import orderRouter from './../routes/order';
import productRouter from './../routes/product';
import productSowing from './../routes/sowing';
import adminUserRouter from './../routes/adminUser';
import collectRouter from './../routes/collect';

const app = express();

// 6. 使用session
app.use(session({
    secret: config.secret,
    name: config.name,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: config.maxAge },
    rolling: true,
    store: new mongoStore({
        url: config.db_url,
        touchAfter: config.maxAge
    })
}));

// 1. 配置公共资源访问路径
app.use(express.static(config.publicPath));

app.all("*", (req, res, next) => { // 设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin", "*"); // 允许的header类型
    res.header("Access-Control-Allow-Headers", "content-type"); // 跨域允许的请求方式
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
    if (req.method.toLowerCase() === 'options') res.send(200); // 让options尝试请求快速结束
    else next();
});

// 2. 配置中间件（nunjucks模板引擎能够作用到views文件夹中的模板）
nunjucks.configure(config.viewsPath, {
    autoescape: true,
    express: app,
    noCache: true // 不使用缓存，模板每次都会重新编译
});

// 5. 配置数据处理的中间件
app.use(bodyParser);

// 7. 配置后端拦截中间件
app.use(loginPass);

// 4. 挂载路由
app.use(indexRouter);
app.use(appUserRouter);
app.use(cartRouter);
app.use(orderRouter);
app.use(productRouter);
app.use(productSowing);
app.use(adminUserRouter);
app.use(collectRouter);


// 5. 挂载错误中间件
app.use(errorLog);

app.use((req, res) => {
    res.render('404.html');
});


app.listen(config.port, () => {
    console.log(`server is running, port: ${config.port}`);
});
