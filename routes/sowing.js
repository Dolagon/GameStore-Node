import express from 'express';
import Sowing from './../models/Sowing';

const router = express.Router({});

/**************************接口API******************************/
// 数据库中插入新纪录 (客户端提交的数据)
router.post('/web/xlmc/api/sowing/add', (req, res, next) => {
    const { image_title, image_url, image_link, s_time, e_time } = req.body;
    const sowing = new Sowing({
        image_title, image_url, image_link, s_time, e_time
    });
    sowing.save((err, result) => {
        if (err) return next(err);
        res.send({
            success_code: 200,
            data: result,
            message: '新增轮播图成功'
        });
    });
});

// 获取轮播图数据
router.get('/web/xlmc/api/sowing/list', (req, res, next) => {
    Sowing.find({}, 'image_title image_url image_link s_time e_time').exec((err, result) => {
        if (err) return err;
        res.json({
            success_code: 200,
            data: result
        });
    });
});

// 根据id删除一条记录
router.get('/web/xlmc/api/sowing/remove/:sowingId', (req, res, next) => {
    Sowing.deleteOne({ _id: req.params.sowingId }, (err, result) => {  // 条件查询
        if (err) return next(err);
        console.log(result);
        res.json({
            status: 200,
            result: '成功删除轮播图'
        });
    });
});

// 获取一条轮播图数据根据id
router.get('/web/xlmc/api/sowing/search/:sowingId', (req, res, next) => {
    Sowing.findById(req.params.sowingId, "_id image_title image_url image_link s_time e_time", (err, docs) => {  // 条件查询
        if (err) return next(err);
        // 数据返回
        res.json({
            status: 200,
            result: docs
        });
    });
});

// 根据id修改轮播图
router.post('/web/xlmc/api/sowing/edit', (req, res, next) => {
    const { sowing_id, image_title, image_url, image_link, s_time, e_time } = req.body;
    Sowing.findById(sowing_id, (err, sowing) => {
        if (err) return next(err);
        // 修改文档内容
        sowing.image_title = image_title;
        sowing.image_url = image_url;
        sowing.image_link = image_link;
        sowing.s_time = s_time;
        sowing.e_time = e_time;

        // 保存
        sowing.save((err, result) => {
            if (err) return next(err);
            res.send({
                success_code: 200,
                data: result,
                message: '轮播图修改成功'
            });
        });
    });
});
/**************************页面路由******************************/

export default router;
