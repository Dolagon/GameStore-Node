import mongoose from 'mongoose';

const adminUserSchema = mongoose.Schema({
    user_name: {type: String, required: true},  // 用户名
    user_pwd: {type: String, required: true},  // 密码
    e_mail: {type: String, default: '1048790189@qq.com'}  // 邮箱
});

const AdminUser = mongoose.model('AdminUser', adminUserSchema);
export default AdminUser;