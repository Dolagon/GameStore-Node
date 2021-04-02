import express from 'express'
import Order from './../models/Order'
import alipaySdk from './../utils/alipay'
import axios from "axios";
const AlipayFormData = require('alipay-sdk/lib/form').default
const router = express.Router({});

// 添加订单
router.post('/web/xlmc/api/order/post', (req, res, next) => {
    const {user_id, cart_shop, shop_price, order_code} = req.body;
    if(user_id){
        const order = new Order({
            user_id,
            cart_shop,
            shop_price,
            order_code
        });
        order.save((err, result) => {
            if (err) {
                return next(Error(err));
            }
            res.send({
                success_code: 200,
                data: {
                    user_id: result.user_id,
                    total_price: result.shop_price,
                    order_code: result.order_code
                },
                message: '订单创建成功！'
            });
        });
    }else {
        return next(Error('非法用户！'));
    }
});
// 完成订单
router.post('/web/xlmc/api/order/change_status', (req, res, next) => {
    const {user_id, order_code} = req.body;
    if (user_id) {
        Order.findOne({user_id, order_code}, (err, result) => {
            if (err) return next(Error(err));
            if (result) {
                result.order_status = 'pay';
                result.save((err, result) => {
                    if (err) return next(Error(err));
                    res.send({
                        success_code: 200,
                        data: result,
                        message: '修改订单状态成功'
                    });
                });
            } else {
                res.send({
                    error_code: 0,
                    message: '当前订单不存在'
                })
            }
        });
    } else {
        return next(Error('非法用户！'));
    }
});
// 获取指定订单
router.post('/web/xlmc/api/order/get', (req, res) => {
    const {user_id, status} = req.body;
    let params = {user_id};
    if(status){
        params = {user_id, order_status: status};
    }
    Order.find(params).exec((err, result) => {
        if (err) {
            return next(err);
        }
        res.json({
            success_code: 200,
            data: result
        });
    });
});
// 根据订单号获取订单
router.post('/web/xlmc/api/order/getById', (req, res) => {
    const {user_id, order_code} = req.body;
    if (user_id) {
        Order.findOne({user_id, order_code: order_code}).exec((err, result) => {
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
// 删除指定订单
router.post('/web/xlmc/api/order/remove', (req, res) => {
    const {user_id, order_code} = req.body;
    Order.deleteOne({user_id, order_code: order_code}, err => {  // 条件查询
        if (err) return next(err);
        res.json({
            status: 200,
            result: '订单已删除'
        });
    });
});

router.post('/web/xlmc/api/order/alipay', (req, res) => {
    (async () => {
        // 调用 setMethod 并传入 get，会返回可以跳转到支付页面的 url
        const formData = new AlipayFormData();
        const {order_code, price, local_url} = req.body;
        formData.setMethod('get');
        // 通过 addField 增加参数
        // 在用户支付完成之后，支付宝服务器会根据传入的 notify_url，以 POST 请求的形式将支付结果作为参数通知到商户系统。
        formData.addField('returnUrl', local_url + '/completed');
        formData.addField('bizContent', {
            outTradeNo: order_code, // 商户订单号,64个字符以内、可包含字母、数字、下划线,且不能重复
            productCode: 'FAST_INSTANT_TRADE_PAY', // 销售产品码，与支付宝签约的产品码名称,仅支持FAST_INSTANT_TRADE_PAY
            totalAmount: price, // 订单总金额，单位为元，精确到小数点后两位
            subject: 'Game Store', // 订单标题
            body: '商品详情', // 订单描述
        });
        const result = await alipaySdk.exec(
            'alipay.trade.wap.pay', // 统一收单下单并支付页面接口
            {}, // api 请求的参数（包含“公共请求参数”和“业务参数”）
            { formData: formData },
        );
        // result 为可以跳转到支付链接的 url
        res.json({
            success_code: 200,
            order_code: order_code,
            url: result
        });
    })();
});


export default router;