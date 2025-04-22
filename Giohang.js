document.addEventListener("DOMContentLoaded", () => {
    const cartItemsContainer = document.getElementById("cartItemsContainer");
    const cartPaymentElement = document.getElementById("cart-payment");
    const cartCountElement = document.getElementById("cartCount");
    const fullNameInput = document.getElementById("fullName");
    const phoneNumberInput = document.getElementById("phoneNumber");
    const emailInput = document.getElementById("email");
    const checkoutBtn = document.getElementById("checkoutBtn");
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    function updateCartDisplay() {
        cartItemsContainer.innerHTML = "";
        let totalPayment = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = "<p>Giỏ hàng trống</p>";
            cartCountElement.textContent = "0"; 
            checkoutBtn.disabled = true; 
        } else {
            cart.forEach((item, index) => {
                totalPayment += item.price * item.quantity;

                const cartItem = document.createElement("div");
                cartItem.classList.add("cart-item");
                cartItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div>
                        <strong>${item.name}</strong>
                        <p>${item.price.toLocaleString()}₫</p>
                    </div>
                    <div class="quantity">
                        <button class="decrease" data-index="${index}">-</button>
                        <span>${item.quantity}</span>
                        <button class="increase" data-index="${index}">+</button>
                    </div>
                    <button class="delete" data-index="${index}">Xóa</button>
                `;
                cartItemsContainer.appendChild(cartItem);
            });

            // Cập nhật số lượng trên icon giỏ hàng
            const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
            cartCountElement.textContent = totalQuantity;
            checkoutBtn.disabled = false; // Kích hoạt nút "Thanh toán"
        }

        // Cập nhật tổng tiền
        cartPaymentElement.textContent = `${totalPayment.toLocaleString()}₫`;
    }

    cartItemsContainer.addEventListener("click", (event) => {
        const index = event.target.dataset.index;
        if (event.target.classList.contains("increase")) {
            cart[index].quantity += 1;
        } else if (event.target.classList.contains("decrease")) {
            if (cart[index].quantity > 1) {
                cart[index].quantity -= 1;
            } else {
                cart.splice(index, 1); // Xóa sản phẩm nếu số lượng là 0
            }
        } else if (event.target.classList.contains("delete")) {
            cart.splice(index, 1); // Xóa sản phẩm khi nhấn nút "Xóa"
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartDisplay();
    });

    updateCartDisplay();

    // Dữ liệu tỉnh, huyện, xã
    const data = {
        HaiDuong: {
            "TP Hải Dương": ["Phường Bình Hàn", "Phường Ngọc Châu", "Xã Gia Xuyên", "Xã Liên Hồng"],
            "Chí Linh": ["Phường Sao Đỏ", "Phường Cộng Hoà", "Xã Hoàng Hoa Thám"],
            "Kinh Môn": ["Phường Phú Thứ", "Xã Hiệp Sơn", "Xã Minh Hoà"],
            "Bình Giang": ["Thị trấn Kẻ Sặt", "Xã Vĩnh Hồng", "Xã Hùng Thắng"],
            "Cẩm Giàng": ["Thị trấn Cẩm Giàng", "Xã Lai Cách", "Xã Đức Chính"],
            "Gia Lộc": ["Thị trấn Gia Lộc", "Xã Toàn Thắng", "Xã Yết Kiêu"],
            "Kim Thành": ["Thị trấn Phú Thái", "Xã Kim Tân", "Xã Kim Xuyên"],
            "Nam Sách": ["Thị trấn Nam Sách", "Xã An Bình", "Xã Minh Tân"],
            "Ninh Giang": ["Thị trấn Ninh Giang", "Xã Hồng Dụ", "Xã Ứng Hoè"],
            "Thanh Hà": ["Thị trấn Thanh Hà", "Xã Tân Việt", "Xã Liên Mạc"],
            "Thanh Miện": ["Thị trấn Thanh Miện", "Xã Ngô Quyền", "Xã Lam Sơn"],
            "Tứ Kỳ": ["Thị trấn Tứ Kỳ", "Xã Quang Phục", "Xã Dân Chủ"]
        },
        HungYen: {
            "TP Hưng Yên": ["Phường Hiến Nam", "Phường Lam Sơn", "Xã Trung Nghĩa"],
            "Mỹ Hào": ["Phường Bần Yên Nhân", "Xã Dị Sử", "Xã Cẩm Xá"],
            "Ân Thi": ["Thị trấn Ân Thi", "Xã Bắc Sơn", "Xã Đa Lộc"],
            "Khoái Châu": ["Thị trấn Khoái Châu", "Xã Đông Tảo", "Xã Bình Minh"],
            "Kim Động": ["Thị trấn Lương Bằng", "Xã Chính Nghĩa", "Xã Hiệp Cường"],
            "Phù Cừ": ["Thị trấn Trần Cao", "Xã Minh Tiến", "Xã Nhật Quang"],
            "Tiên Lữ": ["Thị trấn Vương", "Xã Dị Chế", "Xã Trung Dũng"],
            "Văn Giang": ["Thị trấn Văn Giang", "Xã Cửu Cao", "Xã Long Hưng"],
            "Văn Lâm": ["Thị trấn Như Quỳnh", "Xã Lạc Hồng", "Xã Trưng Trắc"],
            "Yên Mỹ": ["Thị trấn Yên Mỹ", "Xã Trung Hòa", "Xã Liêu Xá"]
        }
    };

    // Hàm tải huyện
    function loadHuyen() {
        const tinh = document.getElementById("tinh").value;
        const huyenSelect = document.getElementById("huyen");
        const xaSelect = document.getElementById("xa");

        huyenSelect.innerHTML = '<option value="">Chọn Quận Huyện</option>';
        xaSelect.innerHTML = '<option value="">Chọn Xã Phường</option>';

        if (tinh && data[tinh]) {
            Object.keys(data[tinh]).forEach(huyen => {
                const option = document.createElement('option');
                option.value = huyen;
                option.text = huyen;
                huyenSelect.add(option);
            });
        }
    }

    // Hàm tải xã
    function loadXa() {
        const tinh = document.getElementById("tinh").value;
        const huyen = document.getElementById("huyen").value;
        const xaSelect = document.getElementById("xa");

        xaSelect.innerHTML = '<option value="">Chọn Xã Phường</option>';

        if (tinh && huyen && data[tinh][huyen]) {
            data[tinh][huyen].forEach(xa => {
                const option = document.createElement('option');
                option.value = xa;
                option.text = xa;
                xaSelect.add(option);
            });
        }
    }

    // Gắn sự kiện cho các dropdown
    document.getElementById("tinh").addEventListener("change", loadHuyen);
    document.getElementById("huyen").addEventListener("change", loadXa);

    // Hàm kiểm tra định dạng họ tên
    function validateFullName(name) {
        const nameRegex = /^[a-zA-ZÀ-ỹ\s]+$/; // Chỉ cho phép chữ cái và khoảng trắng
        return nameRegex.test(name.trim());
    }

    // Hàm kiểm tra định dạng số điện thoại
    function validatePhoneNumber(phone) {
        const phoneRegex = /^(0|\+84)[3-9][0-9]{8}$/; // Số điện thoại Việt Nam hợp lệ
        return phoneRegex.test(phone.trim());
    }

    // Hàm kiểm tra định dạng email
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Định dạng email hợp lệ
        return emailRegex.test(email.trim());
    }

    // Xử lý khi nhấn nút "Thanh toán"
    checkoutBtn.addEventListener("click", (event) => {
        event.preventDefault(); // Ngăn chặn gửi biểu mẫu mặc định

        if (cart.length === 0) {
            alert(" Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi thanh toán.");
            return;
        }

        const fullName = fullNameInput.value;
        const phoneNumber = phoneNumberInput.value;
        const email = emailInput.value;

        if (!validateFullName(fullName)) {
            alert("Vui lòng nhập họ tên hợp lệ (chỉ chứa chữ cái và khoảng trắng).");
            fullNameInput.focus();
            return;
        }

        if (!validatePhoneNumber(phoneNumber)) {
            alert(" Vui lòng nhập số điện thoại hợp lệ (bắt đầu bằng 0 hoặc +84 và có 10 chữ số).");
            phoneNumberInput.focus();
            return;
        }

        if (!validateEmail(email)) {
            alert(" Vui lòng nhập email hợp lệ (ví dụ: example@gmail.com).");
            emailInput.focus();
            return;
        }

        alert("Thanh toán thành công! Cảm ơn bạn đã mua hàng.");
        // Thực hiện các bước tiếp theo, ví dụ: gửi dữ liệu
    });
});