document.addEventListener("DOMContentLoaded", () => {
    const images = [
        "anh/Sanpham2.1.png",
        "anh/Sanpham2.2.png",
        "anh/Sanpham2.3.png",
        "anh/Sanpham2.4.png",
        "anh/Sanpham2.5.png"
    ];

    let currentIndex = 0;
    const mainImage = document.getElementById("mainImage");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const thumbnails = document.querySelectorAll(".thumbnail-images img");

    function showImage(index) {
        mainImage.classList.add("fade-out");
        setTimeout(() => {
            mainImage.src = images[index];
            currentIndex = index;
            updateActiveThumbnail();
            mainImage.classList.remove("fade-out");
        }, 500);
    }

    function updateActiveThumbnail() {
        thumbnails.forEach((thumbnail, index) => {
            thumbnail.style.borderColor = index === currentIndex ? "#ff4d4f" : "#ddd";
        });
    }

    prevBtn.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        showImage(currentIndex);
    });

    nextBtn.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
    });

    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener("click", () => {
            showImage(index);
        });
    });

    setInterval(() => {
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
    }, 3000);

    showImage(currentIndex);

    const cartCountElement = document.getElementById("cartCount");

    function capNhatSoLuongGioHang() {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = totalQuantity;
    }

    const buyNowBtn = document.getElementById("buyNowBtn");

    buyNowBtn.addEventListener("click", () => {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existingProduct = cart.find(item => item.id === product.id);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push(product);
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        capNhatSoLuongGioHang();

        alert("🛒 Đã thêm sản phẩm vào giỏ hàng!");
        window.location.href = "Giohang.html";
    });

    capNhatSoLuongGioHang();

    const product = {
        id: 2, // ID sản phẩm (có thể thay đổi theo sản phẩm)
        name: "Lenovo Legion R7000 2024",
        price: 21590000, // Giá sản phẩm
        oldPrice: 28400000, // Giá cũ (nếu có)
        quantity: 1, // Số lượng mặc định
        image: "anh/Sanpham2.1.png" // Đường dẫn ảnh sản phẩm
    };
});
