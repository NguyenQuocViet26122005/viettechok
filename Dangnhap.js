document.querySelector('.login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const emailInput = document.getElementById('email');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(emailInput.value)) {
        alert('Vui lòng nhập đúng định dạng email (ví dụ: mau@gmail.com).');
    } else {
        
        window.location.href = "index.html";
    }
});