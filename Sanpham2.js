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
        // Kiểm tra đăng nhập trước khi thêm vào giỏ hàng
        if (!window.authCheck || !window.authCheck.checkLoginBeforeAddToCart(() => {
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
        })) {
            return; // Người dùng chưa đăng nhập, đã hiển thị thông báo
        }
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
document.addEventListener("DOMContentLoaded", () => {
  const LENOVO = [
    { name: "Lenovo IdeaPad 5 Pro 16 GT 2025 Ultra 5 225H RAM 32GB SSD 1TB 16\" 2.8K OLED 120Hz", newPrice: 20500000, oldPrice: 24500000, flag: "Đang Có Flash Sale!!!", image: "anh/idea6.png", url: "#" },
    { name: "Lenovo IdeaPad 5 Pro 14 GT 2025 Ultra 9 285H RAM 32GB SSD 1TB 14\" 2.8K OLED 120Hz", newPrice: 26900000, oldPrice: 31900000, flag: "Sản phẩm HOT !!!", image: "anh/idea7.png", url: "#" },
    { name: "Lenovo IdeaPad 5 Pro 2024 AMD Ryzen 7 8745H RAM 24GB SSD 1TB 2.8K OLED 120Hz", newPrice: 16900000, oldPrice: 23500000, flag: "Đang Có Flash Sale!!!", image: "anh/idea3.png", url: "#" },
    { name: "Lenovo IdeaPad 5 Pro 14 GT 2025 Ultra 5 225H RAM 32GB SSD 1TB 14\" 2.8K OLED 120Hz", newPrice: 20200000, oldPrice: 24500000, flag: "Hàng Mới Về Thêm", image: "anh/idea5.png", url: "#" },
    { name: "Lenovo IdeaPad Slim 5 2025 Intel Core5 220H RAM 24GB SSD 1TB 2.8K OLED 120Hz", newPrice: 17900000, oldPrice: 19500000, flag: "Flash Sale", image: "anh/idea2.png", url: "#" },
    { name: "Lenovo IdeaPad Slim 3 2025 Ryzen 7 8745HS RAM 16GB SSD 512GB FHD+", newPrice: 13790000, oldPrice: 14500000, flag: "Sản phẩm HOT !!!", image: "anh/idea1.png", url: "#" }
  ];

  const track = document.getElementById("lenovoTrack");
  const prev = document.getElementById("lvPrev");
  const next = document.getElementById("lvNext");

  if (!track) return;

  // Render sản phẩm
  track.innerHTML = LENOVO.map(p => `
    <div class="lv-card">
      ${p.flag ? `<div class="lv-flag">${p.flag}</div>` : ""}
      ${p.oldPrice ? `<div class="lv-off">-${Math.round((1 - p.newPrice / p.oldPrice) * 100)}%</div>` : ""}
      <a href="${p.url}">
        <img src="${p.image}" alt="${p.name}" class="lv-img">
        <h4 class="lv-title-text">${p.name}</h4>
        <div class="lv-price">
          <span class="new">${p.newPrice.toLocaleString("vi-VN")}đ</span>
          ${p.oldPrice ? `<span class="old">${p.oldPrice.toLocaleString("vi-VN")}đ</span>` : ""}
        </div>
      </a>
    </div>
  `).join('');

  // Nhân đôi để cuộn vòng
  track.innerHTML += track.innerHTML;

  // === Kéo chuột / cảm ứng ===
  let isDown = false, startX = 0, scrollLeft = 0;
  track.addEventListener("pointerdown", e => {
    isDown = true;
    startX = e.clientX;
    scrollLeft = track.scrollLeft;
    track.classList.add("dragging");
    stopAuto();
  });
  track.addEventListener("pointermove", e => {
    if (!isDown) return;
    const dx = e.clientX - startX;
    track.scrollLeft = scrollLeft - dx;
  });
  ["pointerup","pointerleave","pointercancel"].forEach(ev =>
    track.addEventListener(ev, () => {
      if (!isDown) return;
      isDown = false;
      track.classList.remove("dragging");
      startAuto();
    })
  );

  // === Nút trái / phải ===
  const step = () => Math.max(260, track.clientWidth * 0.6);
  prev?.addEventListener("click", () => {
    stopAuto();
    track.scrollBy({ left: -step(), behavior: "smooth" });
    resumeAutoSoon();
  });
  next?.addEventListener("click", () => {
    stopAuto();
    track.scrollBy({ left: step(), behavior: "smooth" });
    resumeAutoSoon();
  });
  
  // Dừng auto-scroll khi click vào nút
  prev?.addEventListener("mousedown", stopAuto);
  next?.addEventListener("mousedown", stopAuto);

  // === Auto-scroll vô hạn ===
  let rafId = null;
  let isPaused = false;
  const speed = 1.2; // px/frame - tăng tốc độ để mượt hơn
  
  function autoLoop() {
    if (isPaused) {
      rafId = requestAnimationFrame(autoLoop);
      return;
    }
    
    track.scrollLeft += speed;
    
    // Reset về đầu khi scroll đến nửa chiều rộng (vì đã nhân đôi nội dung)
    const halfWidth = track.scrollWidth / 2;
    if (track.scrollLeft >= halfWidth) {
      track.scrollLeft = 0;
    }
    
    rafId = requestAnimationFrame(autoLoop);
  }
  
  function startAuto() { 
    isPaused = false;
    if (!rafId) {
      rafId = requestAnimationFrame(autoLoop);
    }
  }
  
  function stopAuto() { 
    isPaused = true;
  }
  
  function resumeAutoSoon() { 
    setTimeout(() => {
      isPaused = false;
    }, 2000); // Tăng thời gian chờ lên 2 giây
  }

  // Dừng khi hover vào track hoặc container
  const container = track.closest('.lv-container') || track.closest('.lv-suggest');
  if (container) {
    container.addEventListener("mouseenter", stopAuto);
    container.addEventListener("mouseleave", startAuto);
  } else {
    track.addEventListener("mouseenter", stopAuto);
    track.addEventListener("mouseleave", startAuto);
  }
  
  // Dừng khi tab không active
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAuto();
    } else {
      startAuto();
    }
  });

  // Bắt đầu auto-scroll
  startAuto();
});

