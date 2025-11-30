// Dangnhap.js
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
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('currentUser', JSON.stringify({ 
            email, 
            name: 'Admin',
            role: 'admin' 
        }));
        window.location.href = "admin.html";
        return;
    }

    // Kiểm tra khách hàng từ state.customers
    const LS_KEY = "laptop_admin_data_v1";
    let adminState = {
        customers: []
    };

    try {
        const raw = localStorage.getItem(LS_KEY);
        if (raw) {
            adminState = JSON.parse(raw);
        }
    } catch (e) {
        console.error("Lỗi đọc dữ liệu admin:", e);
    }

    // Tìm khách hàng theo email
    const customer = adminState.customers?.find(c => c.email === email);
    
    if (customer && customer.password === password) {
        // Đăng nhập thành công
        localStorage.setItem('isAdmin', 'false');
        localStorage.setItem('currentUser', JSON.stringify({ 
            email: customer.email,
            name: customer.name,
            phone: customer.phone,
            username: customer.username,
            role: 'user',
            id: customer.id
        }));
        alert('Đăng nhập thành công! Chào mừng ' + customer.name);
        window.location.href = "index.html";
    } else {
        alert('Email hoặc mật khẩu không đúng. Vui lòng thử lại.');
    }
});
