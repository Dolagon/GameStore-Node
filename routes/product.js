import express from 'express';
import Product from "../models/Product";
import Collect from "../models/Collect";

const router = express.Router({});

// 商品添加
router.post('/web/xlmc/api/product/add', (req, res, next) => {
    const {
        title,
        img,
        ori_price,
        cur_price,
        discount,
        type,
        developers,
        publisher,
        pun_date,
        language,
        system,
        content
    } = req.body;
    const product = new Product({
        title,
        img,
        ori_price,
        cur_price,
        discount,
        type,
        developers,
        publisher,
        pun_date,
        language,
        system,
        content
    });
    product.save((err, result) => {
        if (err) {
            return next(Error(err));
        }
        res.send({
            success_code: 200,
            data: result,
            message: '新增成功'
        });
    });
});

// 获取所有商品数据 根据分类
router.get('/web/xlmc/api/product/total', (req, res) => {
    let type = req.query.type;
    if (type) {
        Product.find({ type: type }, 'title img ori_price cur_price discount type developers publisher pun_date language system content').exec((err, result) => {
            if (err) return err;
            res.json({
                success_code: 200,
                data: result
            });
        });
    } else {
        res.send({
            err_code: 0,
            message: '获取数据失败！'
        });
    }
});

// 根据名称或类型搜索商品
router.get('/web/xlmc/api/product/searchKeywords', (req, res, next) => {
    let keywords = req.query.keywords;
    if (keywords) {
        Product.find({ title: { $regex: new RegExp(keywords.trim(), "i") } }, 'title img ori_price cur_price discount type developers publisher pun_date language system content').exec((err, result) => {
            if (err) return err;
            res.json({
                success_code: 200,
                data: result
            });
        });
    } else {
        res.send({
            err_code: 0,
            message: '输入内容为空'
        });
    }
});

// 根据id删除商品
router.get('/web/xlmc/api/product/remove/:productId', (req, res, next) => {
    Product.deleteOne({ _id: req.params.productId }, (err, result) => {  // 条件查询
        if (err) return next(err);
        console.log(result);
        res.json({
            status: 200,
            result: '商品已删除'
        });
    });
});

// 获取一条商品数据 根据id
router.get('/web/xlmc/api/product/search/:productId', (req, res, next) => {
    Product.findById(req.params.productId, '_id title img ori_price cur_price discount type developers publisher pun_date language system content', (err, docs) => {
        if (err) return next(err);
        res.json({
            status: 200,
            result: docs
        });
    });
});

// 获取一条商品数据 根据id (restful api)
router.get('/web/xlmc/api/product/searchItem', (req, res, next) => {
    let product_id = req.query.product_id;
    if (product_id) {
        Product.findById({ _id: product_id }).exec((err, result) => {
            if (err) return next(err);
            res.send({
                status: 200,
                result: result
            });
        });
    } else {
        res.send({
            err_code: 0,
            message: '获取数据失败！'
        });
    }
});

// 根据id修改商品
router.post('/web/xlmc/api/product/edit', (req, res, next) => {
    const {
        product_id,
        title,
        img,
        ori_price,
        cur_price,
        discount,
        type,
        developers,
        publisher,
        pun_date,
        language,
        system,
        content
    } = req.body;
    Product.findById(product_id, (err, product) => {
        if (err) return next(err);
        product.title = title;
        product.img = img;
        product.ori_price = ori_price;
        product.cur_price = cur_price;
        product.discount = discount;
        product.type = type;
        product.developers = developers;
        product.publisher = publisher;
        product.pun_date = pun_date;
        product.language = language;
        product.system = system;
        product.content = content;

        product.save((err, result) => {
            if (err) return next(err);
            res.send({
                success_code: 200,
                data: result,
                message: '商品修改成功'
            });
        });
    });
});

// 获取总页数
router.get('/web/xlmc/api/product/page', (req, res, next) => {
    let type = req.query.type;
    if (type) {
        Product.countDocuments({ type: type }, (err, count) => {
            if (err) return next(err);
            res.json({
                success_code: 200,
                result: count
            });
        });
    } else {
        Product.countDocuments((err, count) => {
            if (err) return next(err);
            res.json({
                success_code: 200,
                result: count
            });
        });
    }
});

// 获取商品数据 每页5条 分类查询
router.get('/web/xlmc/api/product/list', (req, res, next) => {
    // 接收三个参数
    let page = Number.parseInt(req.query.page, 10) || 1;  // 页码转为10进制默认1
    let pageSize = Number.parseInt(req.query.pageSize, 10) || 5;  // 每页放几条(默认5条数据每页)
    let type = req.query.type;

    if (type) {
        Product.find({ type: type }).skip((page - 1) * pageSize).limit(pageSize).exec((err, source) => {
            if (err) return next(err);
            res.json({
                success_code: 200,
                data: source
            });
        });
    } else if (type === '') {
        Product.find().skip((page - 1) * pageSize).limit(pageSize).exec((err, source) => {
            if (err) return next(err);
            res.json({
                success_code: 200,
                data: source
            });
        });
    } else {
        res.send({
            err_code: 0,
            message: '获取数据失败！'
        });
    }
});

module.exports = router;
