'use strict';
import mongoose from 'mongoose';
import config from './../src/config';
// 连接 协议mongodb 服务器地址localhost 数据库为college
mongoose.connect(config.db_url, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;

// 监听
db.once('open', () => {
    console.log('数据库连接成功~~');
});

db.on('error', error => {
    console.error('连接数据库时发生错误: ' + error);
    mongoose.disconnect();
});

db.on('close', () => {
    console.log('数据库断开，重新连接数据库');
    mongoose.connect(config.db_url, { useNewUrlParser: true });
});

export default db;
