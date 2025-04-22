document.querySelector('.register-form').addEventListener('submit', function (e) {
    e.preventDefault(); 
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
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

    
    window.location.href = "index.html";
});