import mongoose from 'mongoose';

// 创建管理员(用户)的模式对象
const appUserSchema = mongoose.Schema({
    real_name: { type: String, default: 'Peko' },
    user_name: { type: String, required: false },
    user_pwd: { type: String, required: false },
    icon_url: { type: String, default: '20190413_2244_Kiki.png' },
    phone: { type: String, required: false },
    keywords: { type: Array, required: false },
    // 当前编辑的时间
    l_edit: { type: Date, default: Date.now() },
    // 添加时间
    c_time: { type: Date, default: Date.now() },
});

const AppUser = mongoose.model('appuser', appUserSchema);
export default AppUser;
