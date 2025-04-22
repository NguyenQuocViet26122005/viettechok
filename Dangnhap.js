document.querySelector('.login-form').addEventListener('submit', function (e) {
    e.preventDefault(); // Ngăn chặn gửi form mặc định
    const emailInput = document.getElementById('email');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(emailInput.value)) {
        alert('Vui lòng nhập đúng định dạng email (ví dụ: mau@gmail.com).');
    } else {
        // Chuyển hướng đến trang chủ
        window.location.href = "index.html";
    }
});