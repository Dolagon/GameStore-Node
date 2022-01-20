import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// 心愿单模型
const CollectSchema = new Schema({
    goods_id: { type: Schema.Types.ObjectId, required: true }, // 商品ID
    user_id: { type: Schema.Types.ObjectId, required: true },  // 用户ID
    title: { type: String, required: true },  // 标题
    img: { type: String, required: true },  // 图片
    cur_price: { type: Number, default: 0 },  // 现价
});

const CollectModel = mongoose.model('collect', CollectSchema);
export default CollectModel;
