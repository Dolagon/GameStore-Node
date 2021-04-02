import mongoose from 'mongoose'

const ProductSchema = mongoose.Schema({
    title: { type: String, required: false },  // 标题
    img: { type: String, required: false },  // 图片
    ori_price: { type: Number, default: 0 },  // 原价
    cur_price: { type: Number, default: 0 },  // 现价
    discount: { type: String, required: false },  // 折扣
    type: { type: Number, required: false },  // 分类
    developers: { type: String, required: false },  // 开发商
    publisher: { type: String, required: false },  // 发行商
    pun_date: { type: String, default: '2020年7月23日' },  // 发行日期
    language: { type: String, required: false },  // 语言
    system: { type: String, required: false },  // 系统
    content: { type: String, required: false }  // 简介
});

const ProductModel = mongoose.model('product', ProductSchema);
export default ProductModel;