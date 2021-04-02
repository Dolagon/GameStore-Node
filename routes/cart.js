import express from 'express'
import Cart from './../models/Cart'

const router = express.Router({});

router.post('/web/xlmc/api/cart/add', (req, res, next) => {
    const {user_id, goods_id, goods_name, goods_price, small_image} = req.body;
    if (user_id) {
        Cart.find({user_id, goods_id}, (err, result) => {
            if (err) {
                return next(err);
            }
            if (result.length > 0) {
                result[0].save((err) => {
                    if (err) {
                        return next(Error(err));
                    }
                    res.send({
                        success_code: 200,
                        data: result[0],
                        message: '新增成功'
                    })
                })
            } else {
                const cart = new Cart({
                    goods_id,
                    user_id,
                    goods_name,
                    goods_price,
                    small_image
                });

                cart.save((err, result) => {
                    if (err) {
                        return next(Error(err));
                    }
                    res.send({
                        success_code: 200,
                        data: result,
                        message: '新增成功'
                    })
                })
            }
        });
    } else {
        return next(Error('非法用户！'));
    }

});

/**
 * 获取购物车数据
 */
router.get('/web/xlmc/api/cart/search/:userid', (req, res) => {
    const user_id = req.params.userid;
    if (user_id) {
        Cart.find({user_id, isDel: false}).exec((err, result) => {
            if (err) {
                return next(err);
            }
            res.json({
                success_code: 200,
                data: result
            });
        });
    } else {
        return next(Error('非法用户！'));
    }

});

/**
 * 删除当前用户所有购物车中的商品
 */
router.get('/web/xlmc/api/cart/clear/:userid', (req, res, next) => {
    const user_id = req.params.userid;
    if (user_id) {
        Cart.deleteMany({user_id}, (err, result) => {
            if (err) return next(Error(err));
            console.log(result);
            res.send({
                success_code: 200,
                message: '购物车已清空'
            })
        })
    } else {
        return next(Error('非法用户！'));
    }
});

/*
  单个商品选中和取消选中
*/
router.post('/web/xlmc/api/cart/singer_select', (req, res, next) => {
    const {user_id, goods_id} = req.body;
    if (user_id) {
        Cart.findOne({goods_id, user_id}, (err, result) => {
            if (err) return next(Error(err));
            if (result) {
                result.checked = !result.checked;
                result.save((err, result) => {
                    if (err) return next(Error(err));
                    res.send({
                        success_code: 200,
                        data: result,
                        message: '修改成功'
                    });
                });
            } else {
                res.send({
                    error_code: 0,
                    message: '购物车中没有该商品'
                })
            }
        });
    } else {
        return next(Error('非法用户！'));
    }
});

/*
  全选和取消全选
*/
router.post('/web/xlmc/api/cart/all_select', (req, res, next) => {
    const {user_id, flag} = req.body;
    if (user_id) {
        Cart.updateMany({user_id}, {checked: !flag}, (err, result) => {
            if (err) return next(Error(err));
            res.send({
                success_code: 200,
                data: result,
                message: '更新成功!'
            });
        });
    } else {
        return next(Error('非法用户！'));
    }
});

/*
  查询所有已被选中的购物车商品
*/
router.get('/web/xlmc/api/cart/selected/:userid', (req, res, next) => {
    const user_id = req.params.userid;
    if (user_id) {
        Cart.find({user_id, checked: true}, (err, result) => {
            if (err) return next(Error(err));
            res.send({
                success_code: 200,
                data: result,
                message: '查询成功！'
            })
        })
    } else {
        return next(Error('非法用户！'));
    }
});

/*
  删除所有已被选中的购物车商品
*/
router.get('/web/xlmc/api/cart/del_checked/:userid', (req, res, next) => {
    const user_id = req.params.userid;
    if (user_id) {
        Cart.deleteMany({user_id, checked: true}, err => {
            if (err) return next(Error(err));
            res.send({
                success_code: 200,
                message: '所选商品已被删除'
            })
        })
    } else {
        return next(Error('非法用户！'));
    }
});

module.exports = router;

