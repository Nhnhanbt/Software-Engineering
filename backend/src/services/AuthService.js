const { message } = require('antd');
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { error } = require('console');
const axios = require('axios');
const supportFunction = require('./support');

class AuthService {
    createUser = async (data) => {
        const { email, password, name, uid } = data;
        return new Promise(async (resolve, reject) => {
            try {
                const [existingUsers] = await db.query('SELECT * FROM user WHERE email = ?', [email]);
                if (existingUsers.length > 0) { 
                    resolve({ status: false, message: "Email đã được dùng" });
                    return;
                }
                const [existingUsersUID] = await db.query('SELECT * FROM user WHERE id = ?', [uid]);
                if (existingUsersUID.length > 0) { 
                    resolve({ status: false, message: "Người dùng đã tạo tài khoản" });
                    return;
                }
                if (typeof email === 'object' && email !== null) email = String(email.address);
                if (typeof email !== 'string' || !email.endsWith('@hcmut.edu.vn')) {
                    resolve({ status: false, message: "Email không đúng định dạng" });
                    return;
                }
                const hashedPassword = await bcrypt.hash(password, 10);
                const start = supportFunction.startTime();
                const [trang_in] = await db.query('SELECT * FROM he_thong');
                    if (trang_in.length == 0) {
                        resolve({ status: false, message: "Chưa cài đặt hệ thống" });
                        return;
                    }
                const page = trang_in[0].so_giay_mac_dinh;
                const [result] = await db.query(
                    'INSERT INTO user (email, password, ten, id, ngay_dk, role) VALUES (?, ?, ?, ?, ?, ?)', 
                    [email, hashedPassword, name, uid, start, 'SV']
                );
                if (result.affectedRows === 1) {
                    const [sinh_vien] = await db.query(
                        'INSERT INTO sinh_vien (id, trang_thai, so_giay_con) VALUES (?, ?, ?)', 
                        [uid, '1', page]
                    );
                    if (sinh_vien.affectedRows === 1) {
                        resolve({
                            status: true,
                            name: name,
                            email: email,
                            role: 'SV',
                            so_giay_con: page
                        });
                    }
                    else resolve({ status: false, message: "Không thể tạo sinh viên" });
                } 
                else resolve({ status: false, message: "Không thể tạo tài khoản" });
            }
            catch (error) {
                reject(error);
            }
        });
    }

    logout = (req) => {
        return new Promise((resolve, reject) => {
            if (req.session.user) {
                req.session.destroy((err) => {
                    if (err) reject({ status: false, message: 'Đăng xuất thất bại' });
                    else resolve({ status: true, message: 'Đăng xuất thành công' });
                });
            } 
            else resolve({ status: false, message: 'Chưa đăng nhập' });
        });
    }    

    login = async (data, req) => {
        const { email, password } = data;
        return new Promise(async (resolve, reject) => {
            try {
                const [rows] = await db.query('SELECT * FROM user WHERE email = ?', [email]);
                if (rows.length === 0) {
                    resolve({ status: false, message: "Tài khoản không tồn tại" });
                    return;
                }
                const user = rows[0];
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    resolve({ status: false, message: "Mật khẩu sai" });
                    return;
                }
                if (user.role == 'SV') {
                    const [sinh_vien] = await db.query('SELECT * FROM sinh_vien WHERE id = ?', [user.id]);
                    const SV = sinh_vien[0];
                    if (SV.trang_thai == 0) {
                        resolve({ status: false, message: "Tài khoản đã bị cấm" });
                        return;   
                    }
                }
                fetch("https://api.ipify.org?format=json")
                .then(response => response.json())
                .then(async data => {
                    const IP = data.ip;
                    req.session.user = {
                        id: user.id,
                        name: user.ten,
                        email: user.email,
                        role: user.role
                    };
                    const thoi_gian = supportFunction.startTime();
                    const [result] = await db.query(
                        'INSERT INTO nhat_ky (uid, noi_dung, thoi_gian) VALUES (?, ?, ?)', 
                        [user.id, `Đã đăng nhập tài khoản IP: ${IP}`, thoi_gian]
                    );
                    if (result.affectedRows === 1) {
                        resolve({
                            status: true,
                            name: user.name,
                            email: user.email,
                        });
                    } 
                    else resolve({ status: false, message: "Không thể lưu IP" });
                });
            } 
            catch (error) {
                reject(error);
            }
        });
    }

    forgotPassword = async (body) => {
        const { email } = body
        return new Promise (async (resolve, reject) => {
            try {
                const [existingUsers] = await db.query('SELECT * FROM user WHERE email = ?', [email]);
                if (existingUsers.length === 0) resolve({ status: false, message: "Tài khoản không tồn tại" });
                const newPassword = Math.random().toString(36).slice(-8);
                const hashedPassword = await bcrypt.hash(newPassword, 10);
                const updatePasswordQuery = `UPDATE user SET password = ? WHERE email = ?`;
                const [result] = await db.query(updatePasswordQuery, [hashedPassword, email]);
                if (result.affectedRows === 1) {
                    const data = {
                        email,
                        mess: `Đây là mật khẩu mới của bạn ${newPassword}`
                    };
                    axios.post('https://ttdev.id.vn/send.php', data)
                    .then(response => {
                        if (response.data.status === 'success') {
                            resolve({
                                email: email,
                                password: newPassword
                            });
                        } 
                        else {
                            reject({ status: false, message: "Lỗi khi gửi mail" });
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
                }
                else resolve({ status: false, message: "Cập nhật mật khẩu thất bại" });
            } 
            catch (error) {
                reject(error);
            }
        });
    }

    changePassword = async (data) => {
        const { currentPassword, newPassword, email } = data;
        return new Promise(async (resolve, reject) => {
            try {
                const [rows] = await db.query('SELECT * FROM user WHERE email = ?', [email]);
                if (rows.length === 0) {
                    resolve({ status: false, message: "Tài khoản không tồn tại" });
                    return;
                }
                const user = rows[0];
                const isMatch = await bcrypt.compare(currentPassword, user.password);
                if (!isMatch) {
                    resolve({ status: false, message: "Mật khẩu sai" });
                    return;
                }
                const hashedPassword = await bcrypt.hash(newPassword, 10);
                const updatePasswordQuery = `UPDATE user SET password = ? WHERE email = ?`;
                const [result] = await db.query(updatePasswordQuery, [hashedPassword, email]);
                if (result.affectedRows === 1) {
                    resolve({
                        email: email,
                        password: newPassword
                    });
                } else resolve({ status: false, message: "Cập nhật mật khẩu thất bại" });
            }
            catch (error) {
                reject(error);
            }
        });
    };
}

module.exports = new AuthService