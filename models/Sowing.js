import mongoose from 'mongoose';

// 创建轮播图模式对象
const sowingSchema = mongoose.Schema({
    image_title: {type: String, required: false},  // 图片名称
    image_url: {type: String, required: false},  // 图片地址
    image_link: {type: String, required: false},  // 图片链接
    s_time: {type: String, required: false},  // 上架时间
    e_time: {type: String, required: false}  // 下架时间\
});

// 生成model 输出sowingSchema
const Sowing = mongoose.model('Sowing', sowingSchema);
export default Sowing;  // 抛出Sowing