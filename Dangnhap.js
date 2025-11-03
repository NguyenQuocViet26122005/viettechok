// Dangnhap.js (thay thế toàn bộ file)
document.querySelector('.login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert('Vui lòng nhập đúng định dạng email (ví dụ: mau@gmail.com).');
        return;
    }

    // ==== Cấu hình tài khoản admin (đổi nếu cần) ====
    const ADMIN_EMAIL = 'admin@viettech.com';
    const ADMIN_PASSWORD = 'Admin@123';
    // ==============================================

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        // Đăng nhập admin thành công
        localStorage.setItem('isAdmin', 'true'); // flag để bảo vệ trang admin
        // (tuỳ chọn) lưu thông tin user
        localStorage.setItem('currentUser', JSON.stringify({ email, role: 'admin' }));
        // chuyển đến trang admin
        window.location.href = "admin.html";
        return;
    }

    // Nếu không phải admin: xử lý như user bình thường (giữ hành vi cũ)
    // Bạn có thể sửa phần này để kiểm tra user khác, đăng ký, v.v.
    localStorage.setItem('isAdmin', 'false');
    localStorage.setItem('currentUser', JSON.stringify({ email, role: 'user' }));
    window.location.href = "index.html";
});
