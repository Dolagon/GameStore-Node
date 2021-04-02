import express from 'express';
import AdminUser from "../models/AdminUser";
import md5 from "blueimp-md5";
const router = express.Router({});

// 生成后台管理员
router.post('/web/xlmc/api/admin/add', (req, res, next) => {
    const { user_name, user_pwd, e_mail } = req.body;

    // 查询数据库
    AdminUser.findOne({user_name}, (err, user)=>{
        if (user) { // 用户已经注册
            res.send({err_code: 0, message: '用户名已存在!'});
        } else {
            const adminUser = new AdminUser({ user_name, user_pwd, e_mail });
            adminUser.save((err, result) => {
                if (err) return next(err);
                res.send({
                    success_code: 200,
                    data: result,
                    message: '管理员添加成功'
                });
            });
        }
    });
});

// 获取所有管理员信息
router.get('/web/xlmc/api/admin/list', (req, res, next) => {
    AdminUser.find({}, 'user_name e_mail').exec((err, result)=>{
        if (err) return err;
        res.json({
            success_code: 200,
            data: result
        });
    });
});

// 管理员登陆验证
router.post('/web/xlmc/api/admin/login', (req, res)=>{
    console.log('----', req.body);
    // 获取数据
    let user_name = req.body.user_name;
    let user_pwd = md5(req.body.user_pwd);
    console.log('/web/xlmc/api/admin/login', user_name, user_pwd);

    // 查询数据库
    AdminUser.findOne({user_name}, (err, user)=>{
        if (user) { // 用户已经注册
            if (user.user_pwd !== user_pwd){ // 密码错误
                res.send({err_code: 0, message: '密码不正确!'});
            } else {
                res.send({
                    success_code: 200,
                    data: user
                });
            }
        } else {
            res.send({err_code: 0, message: '管理员不存在!'});
        }
    });
});

// 根据id注销管理员账号
router.post('/web/xlmc/api/admin/remove/:adminId', (req, res, next) => {
    if (req.body.user_name === 'admin') {
        res.send({err_code: 0, message: '无法注销该账户！'});
    } else {
        AdminUser.deleteOne({_id: req.params.adminId}, (err, result)=>{  // 条件查询
            if (err) return next(err);
            console.log(result);
            res.json({
                status: 200,
                message: '已注销该账号!'
            });
        });
    }
});

export default router;