import express from 'express'
const router = express.Router({});
import AppUser from './../models/AppUser'
import md5 from 'blueimp-md5'
import config from "../src/config";
import fs from 'fs'

// 用户信息
let users = {};

/**
 * 用户名和密码登录
 */
router.post('/web/xlmc/api/login_pwd', (req, res)=>{
    //  1. 获取数据
    let user_name = req.body.user_name;
    let user_pwd = md5(req.body.user_pwd);
    console.log('/web/xlmc/api/login_pwd', user_name, user_pwd, req.session);

    // 4. 查询数据库
    AppUser.findOne({user_name}, (err, user)=>{
        if(user){ // 4.1 用户已经注册
            if(user.user_pwd !== user_pwd){ // 密码错误
                res.send({err_code: 0, message: '用户名或密码不正确!'});
            } else {
                req.session.userid = user._id;
                res.send({
                    success_code: 200,
                    data: {
                        token: user._id,
                        real_name: user.real_name,
                        user_name: user.user_name,
                        phone: user.phone,
                        icon_url: user.icon_url,
                    }
                });
            }
        } else {
            res.send({
               err_code: 0,
               message: '用户名不存在'
            });
        }
    });
});

// 用户注册
router.post('/web/xlmc/api/signup', (req, res) => {
    //  1. 获取数据
    let user_name = req.body.user_name;
    let user_pwd = md5(req.body.user_pwd);
    let phone = req.body.phone;

    AppUser.findOne({user_name}, (err, user)=>{
        if (user) { // 已经注册
            res.send({err_code: 0, message: '用户名已存在!'});
        } else {
            let userModel = new AppUser({user_name, user_pwd, phone});
            userModel.save(function (err, user) {
                req.session.userid = user._id;
                res.send({
                    success_code: 200,
                    data: {
                        token: user._id,
                        real_name: user.real_name,
                        user_name: user.user_name,
                        phone: user.phone
                    }
                });
            });
        }
    });
});

// 上传用户图像
router.post('/web/xlmc/api/user_img', (req, res, next) => {
    const imgData = req.body.imgData;
    const imgName = req.body.imgName;
    const lastmodified = req.body.lastmodified; //对应前端的三个参数
    //Buffer()构造函数已经弃用，此处用Buffer.from建立缓冲区
    let dataBuffer = Buffer.from(imgData, 'base64');
    fs.writeFile(config.uploadPath + imgName, dataBuffer, (err, result) => {
        //用fs.write写入base64数据生成图片 此处需要手动创建img文件夹，否则会报错
        //预想把路径同时写入数据库，但表未设计好，待更新验证
        if (err) {
            res.send(err)
        } else {
            res.send({
                success_code: 200,
                data: result,
                message: '上传成功'
            })
        }
    });
});

// 修改用户信息
router.post('/web/xlmc/api/user_set', (req, res, next) => {
    const {user_id, real_name, icon_url} = req.body;
    if (user_id) {
        AppUser.findOne({_id: user_id}, (err, user) => {
            if (err) return next(Error(err));
            user.real_name = real_name;
            user.icon_url = icon_url;
            user.save((err, result) => {
                if (err) return next(Error(err));
                res.send({
                    success_code: 200,
                    data: result,
                    message: '信息修改成功'
                });
            });
        });
    } else {
        return next(Error('非法用户！'));
    }
});


/*
  根据session中的userid, 去查询对应的用户返回给客户端
*/
const filter = {'pwd': 0, 'l_time': 0, '__v': 0};
router.get('/web/xlmc/api/userinfo', (req, res)=>{
    // 1. 取出userId
    const userId = req.session.userid;
    // 2. 查询
    AppUser.findOne({_id: userId}, filter, (err, user)=>{
        if(!user){
            // 清除上一次的userId
            delete req.session.userid;
            res.send({err_code: 0, message: '请先登录'});
        }else {
            res.send({
                success_code: 200,
                data: {
                    token: user._id,
                    real_name: user.real_name,
                    user_name: user.user_name,
                    phone: user.phone,
                    icon_url: user.icon_url
                }
            });
        }
    })
});

// 退出登录
router.get('/web/xlmc/api/logout', (req, res)=>{
    // 清除session中的userid
    delete req.session.userid;
    // 返回数据
    res.send({success_code: 200, message: '退出登录成功'});
});

// 输出
export default router;