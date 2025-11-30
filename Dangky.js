document.querySelector('.register-form').addEventListener('submit', function (e) {
    e.preventDefault(); 
    const fullnameInput = document.getElementById('fullname');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const passwordInput = document.getElementById('password');
    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^0[0-9]{9}$/; 

    if (!emailPattern.test(emailInput.value)) {
        alert('Vui lòng nhập đúng định dạng email (ví dụ: example@domain.com).');
        return;
    }

    if (!phonePattern.test(phoneInput.value)) {
        alert('Số điện thoại phải bắt đầu bằng 0 và có 10 chữ số.');
        return;
    }

    // Lấy dữ liệu admin từ localStorage
    const LS_KEY = "laptop_admin_data_v1";
    let adminState = {
        products: [],
        orders: [],
        promotions: [],
        categories: [],
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

    // Kiểm tra email đã tồn tại chưa
    const existingCustomer = adminState.customers.find(c => c.email === emailInput.value.trim());
    if (existingCustomer) {
        alert('Email này đã được đăng ký. Vui lòng sử dụng email khác hoặc đăng nhập.');
        return;
    }

    // Tạo username từ email (phần trước @)
    const username = emailInput.value.trim().split('@')[0];

    // Tạo khách hàng mới
    const newCustomer = {
        id: "CUST" + Date.now(),
        name: fullnameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        username: username,
        password: passwordInput.value,
        orderCount: 0,
        totalSpent: 0
    };

    // Thêm vào danh sách khách hàng
    if (!adminState.customers) {
        adminState.customers = [];
    }
    adminState.customers.push(newCustomer);

    // Lưu lại vào localStorage
    try {
        localStorage.setItem(LS_KEY, JSON.stringify(adminState));
        alert('Đăng ký thành công! Vui lòng đăng nhập.');
        window.location.href = "Dangnhap.html";
    } catch (e) {
        console.error("Lỗi lưu dữ liệu:", e);
        alert('Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.');
    }
});