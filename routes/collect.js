import express from 'express';
import Collect from "../models/Collect";

const router = express.Router({});

// 添加商品到心愿单
router.post('/web/xlmc/api/collect/add', (req, res, next) => {
    const { user_id, goods_id, title, img, cur_price } = req.body;
    if (user_id) {
        Collect.findOne({ user_id, goods_id }, (err, result) => {
            if (err) return next(err);
            if (result) {
                res.send({
                    err_code: 0,
                    message: '心愿单已存在改商品'
                });
            } else {
                const collect = new Collect({
                    user_id,
                    goods_id,
                    title,
                    img,
                    cur_price
                });
                collect.save((err, result) => {
                    if (err) return next(Error(err));
                    res.send({
                        success_code: 200,
                        data: result,
                        message: '新增成功'
                    });
                });
            }
        });
    } else {
        return next(Error('非法用户！'));
    }
});

// 查询商品是否存在于心愿单
router.post('/web/xlmc/api/collect/inList', (req, res, next) => {
    const { user_id, goods_id } = req.body;
    if (user_id) {
        Collect.findOne({ user_id, goods_id }, (err, result) => {
            if (err) return next(err);
            if (result) {
                res.send({
                    success_code: 200,
                    message: '心愿单已存在改商品'
                });
            } else {
                res.send({
                    success_code: 200,
                    message: '未收藏改商品'
                });
            }
        });
    } else {
        return next(Error('非法用户！'));
    }
});

// 获取用户的心愿单商品
router.get('/web/xlmc/api/collect/get/:userid', (req, res, next) => {
    const user_id = req.params.userid;
    console.log('user_id:', user_id);
    if (user_id) {
        Collect.find({ user_id }).exec((err, result) => {
            if (err) return next(err);
            res.send({
                success_code: 200,
                data: result
            });
        });
    } else {
        return next(Error('非法用户！'));
    }
});

// 删除心愿单的商品
router.post('/web/xlmc/api/collect/remove', (req, res, next) => {
    const { user_id, goods_id } = req.body;
    Collect.deleteOne({ user_id, goods_id: goods_id }, err => {  // 条件查询
        if (err) return next(err);
        res.send({
            success_code: 200,
            result: '已删除'
        });
    });
});

module.exports = router;
