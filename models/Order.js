import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// 地址模型
const OrderSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, required: true },  // 用户ID
    cart_shop: { type: Array, required: true }, // 已下单购物车商品
    shop_price: { type: Number, required: true }, // 商品金额
    order_code: { type: String, required: true },  // 订单编号
    order_status: { type: String, default: 'will' }, // 待支付 will  待收货 pay
    ctime: { type: String, default: new Date(Date.now()).toLocaleString() }
});

const OrderModel = mongoose.model('order', OrderSchema);
export default OrderModel;
