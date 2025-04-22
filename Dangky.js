document.querySelector('.register-form').addEventListener('submit', function (e) {
    e.preventDefault(); // Ngăn chặn gửi form mặc định

    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Biểu thức kiểm tra định dạng email
    const phonePattern = /^0[0-9]{9}$/; // Số điện thoại bắt đầu bằng 0 và có 10 chữ số

    if (!emailPattern.test(emailInput.value)) {
        alert('Vui lòng nhập đúng định dạng email (ví dụ: example@domain.com).');
        return;
    }

    if (!phonePattern.test(phoneInput.value)) {
        alert('Số điện thoại phải bắt đầu bằng 0 và có 10 chữ số.');
        return;
    }

    // Nếu cả email và số điện thoại hợp lệ, chuyển hướng đến trang chủ
    window.location.href = "index.html";
});