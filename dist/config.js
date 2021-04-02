'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _path = require('path');

exports.default = {
    viewsPath: (0, _path.join)(__dirname, '../views'),
    publicPath: (0, _path.join)(__dirname, '../public'),
    uploadPath: (0, _path.join)(__dirname, '../public/uploads'),
    // port: parseInt(process.env.PORT, 10) || 3000,
    port: 3001,
    secret: 'itlike.com',
    name: 'likeid',
    maxAge: 1800000,
    db_url: 'mongodb://localhost:27017/college'
};