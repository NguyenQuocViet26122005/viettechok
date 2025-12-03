// Script để render trang chi tiết sản phẩm từ admin
(function() {
  const LS_KEY = "laptop_admin_data_v1";
  
  // Lấy ID sản phẩm từ URL
  function getProductIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
  }
  
  // Format giá tiền
  function formatPrice(price) {
    return new Intl.NumberFormat("vi-VN").format(price || 0);
  }
  
  // Tính phần trăm giảm giá
  function calculateDiscount(price, oldPrice) {
    if (!oldPrice || oldPrice <= price) return 0;
    return Math.round((1 - price / oldPrice) * 100);
  }
  
  // Load sản phẩm từ localStorage
  function loadProduct(productId) {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) {
        console.error("Không tìm thấy dữ liệu sản phẩm");
        return null;
      }
      
      const data = JSON.parse(raw);
      const products = data.products || [];
      const product = products.find(p => p.id === productId);
      
      return product || null;
    } catch (error) {
      console.error("Lỗi khi load sản phẩm:", error);
      return null;
    }
  }
  
  // Render ảnh sản phẩm
  function renderProductImages(product) {
    const mainImage = document.getElementById('mainImage');
    const thumbnailContainer = document.querySelector('.thumbnail-images');
    
    if (!product) return;
    
    const images = product.images && product.images.length > 0 
      ? product.images 
      : (product.mainImage ? [product.mainImage] : ['anh/no-image.png']);
    
    // Set main image
    if (mainImage) {
      mainImage.src = images[0];
      mainImage.alt = product.name || 'Sản phẩm';
    }
    
    // Render thumbnails
    if (thumbnailContainer) {
      thumbnailContainer.innerHTML = images.map((img, index) => 
        `<img src="${img}" alt="Hình ảnh ${index + 1}" onerror="this.src='anh/no-image.png'">`
      ).join('');
      
      // Thêm event listener cho thumbnails
      thumbnailContainer.querySelectorAll('img').forEach((thumb, index) => {
        thumb.addEventListener('click', () => {
          if (mainImage) {
            mainImage.src = images[index];
          }
          // Update active thumbnail
          thumbnailContainer.querySelectorAll('img').forEach(t => {
            t.style.borderColor = '#ddd';
          });
          thumb.style.borderColor = '#ff4d4f';
        });
      });
    }
    
    // Update image navigation
    if (window.currentImageIndex === undefined) {
      window.currentImageIndex = 0;
    }
    
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) {
      prevBtn.onclick = () => {
        window.currentImageIndex = (window.currentImageIndex - 1 + images.length) % images.length;
        if (mainImage) mainImage.src = images[window.currentImageIndex];
      };
    }
    
    if (nextBtn) {
      nextBtn.onclick = () => {
        window.currentImageIndex = (window.currentImageIndex + 1) % images.length;
        if (mainImage) mainImage.src = images[window.currentImageIndex];
      };
    }
  }
  
  // Render thông tin sản phẩm
  function renderProductInfo(product) {
    if (!product) return;
    
    // Tên sản phẩm
    const title = document.querySelector('.product-info h1');
    if (title) {
      title.textContent = product.name || 'Chưa có tên';
    }
    
    // Giá
    const priceContainer = document.querySelector('.product-info .price');
    if (priceContainer) {
      let oldPrice = product.oldPrice;
      let discount = 0;
      
      if (oldPrice && oldPrice > product.price) {
        discount = calculateDiscount(product.price, oldPrice);
      }
      
      priceContainer.innerHTML = `
        <span class="current-price">${formatPrice(product.price || 0)}đ</span>
        ${oldPrice && oldPrice > product.price ? `<span class="original-price">${formatPrice(oldPrice)}đ</span>` : ''}
        ${discount > 0 ? `<span class="discount">-${discount}%</span>` : ''}
      `;
    }
    
    // Mô tả trong phần "Đánh giá chi tiết"
    const descriptionEl = document.getElementById('productDescription');
    if (descriptionEl) {
      if (product.description) {
        descriptionEl.textContent = product.description;
      } else {
        descriptionEl.textContent = 'Sản phẩm chất lượng cao, được kiểm tra kỹ lưỡng trước khi giao hàng.';
      }
    }
    
    // Render các tính năng nếu có
    const featuresEl = document.getElementById('productFeatures');
    if (featuresEl) {
      if (product.features && Array.isArray(product.features) && product.features.length > 0) {
        featuresEl.innerHTML = product.features.map(feature => `<li>${feature}</li>`).join('');
      } else {
        // Tính năng mặc định dựa trên thông tin sản phẩm
        const defaultFeatures = [];
        if (product.cpu) defaultFeatures.push(`CPU: ${product.cpu}`);
        if (product.ram) defaultFeatures.push(`RAM: ${product.ram}`);
        if (product.storage) defaultFeatures.push(`Ổ cứng: ${product.storage}`);
        if (product.gpu) defaultFeatures.push(`VGA: ${product.gpu}`);
        if (product.screen) defaultFeatures.push(`Màn hình: ${product.screen}`);
        
        if (defaultFeatures.length > 0) {
          featuresEl.innerHTML = defaultFeatures.map(f => `<li>${f}</li>`).join('');
        } else {
          featuresEl.innerHTML = `
            <li>Thiết kế hiện đại, sang trọng</li>
            <li>Hiệu năng mạnh mẽ, ổn định</li>
            <li>Màn hình sắc nét, màu sắc chân thực</li>
            <li>Pin lâu, tiết kiệm điện</li>
            <li>Bảo hành chính hãng</li>
          `;
        }
      }
    }
    
    // Render ảnh đánh giá nếu có
    const reviewImagesEl = document.getElementById('productReviewImages');
    if (reviewImagesEl && product.images && product.images.length > 1) {
      // Hiển thị các ảnh từ vị trí 1 trở đi (ảnh đầu tiên đã dùng làm main image)
      const reviewImages = product.images.slice(1, 4); // Lấy tối đa 3 ảnh
      if (reviewImages.length > 0) {
        reviewImagesEl.innerHTML = reviewImages.map((img, index) => 
          `<img src="${img}" alt="Ảnh đánh giá ${index + 1}" onerror="this.style.display='none'">`
        ).join('');
      }
    }
  }
  
  // Render bảng thông tin kỹ thuật
  function renderSpecifications(product) {
    const specTable = document.querySelector('.specifications-table');
    if (!specTable || !product) return;
    
    const specs = [
      { label: 'CPU', value: product.cpu || 'Chưa cập nhật' },
      { label: 'RAM', value: product.ram || 'Chưa cập nhật' },
      { label: 'Ổ cứng', value: product.storage || 'Chưa cập nhật' },
      { label: 'VGA', value: product.gpu || 'Chưa cập nhật' },
      { label: 'Màn hình', value: product.screen || 'Chưa cập nhật' },
      { label: 'Hãng', value: product.brand || 'Chưa cập nhật' },
      { label: 'Danh mục', value: product.category || 'Chưa cập nhật' },
      { label: 'Tồn kho', value: product.stock ? `${product.stock} sản phẩm` : 'Chưa cập nhật' },
    ];
    
    // Thêm các trường khác nếu có
    if (product.weight) {
      specs.push({ label: 'Trọng lượng', value: product.weight });
    }
    if (product.color) {
      specs.push({ label: 'Màu sắc', value: product.color });
    }
    if (product.size) {
      specs.push({ label: 'Kích thước', value: product.size });
    }
    
    specTable.innerHTML = specs.map(spec => `
      <tr>
        <th>${spec.label}</th>
        <td>${spec.value}</td>
      </tr>
    `).join('');
  }
  
  // Cập nhật nút "Mua ngay"
  function setupBuyButton(product) {
    const buyBtn = document.getElementById('buyNowBtn');
    if (!buyBtn || !product) return;
    
    buyBtn.addEventListener('click', () => {
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      
      const existingProduct = cart.find(item => item.id === product.id);
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          oldPrice: product.oldPrice,
          quantity: 1,
          image: product.mainImage || (product.images && product.images[0]) || 'anh/no-image.png'
        });
      }
      
      localStorage.setItem('cart', JSON.stringify(cart));
      
      // Cập nhật số lượng giỏ hàng
      const cartCount = document.getElementById('cartCount');
      if (cartCount) {
        const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalQuantity;
      }
      
      alert('🛒 Đã thêm sản phẩm vào giỏ hàng!');
      window.location.href = 'Giohang.html';
    });
  }
  
  // Render toàn bộ trang chi tiết
  function renderProductDetail() {
    const productId = getProductIdFromURL();
    
    if (!productId) {
      console.log("Không có ID sản phẩm trong URL");
      // Hiển thị thông báo nếu không có ID
      const productContainer = document.querySelector('.product-container');
      if (productContainer) {
        productContainer.innerHTML = `
          <div style="text-align: center; padding: 60px 20px;">
            <h2 style="color: #dc3545; margin-bottom: 20px;">Không tìm thấy sản phẩm</h2>
            <p style="font-size: 16px; color: #666; margin-bottom: 30px;">Vui lòng chọn sản phẩm từ trang chủ.</p>
            <a href="index.html" style="display: inline-block; padding: 12px 30px; background-color: #007bff; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">Về trang chủ</a>
          </div>
        `;
      }
      return;
    }
    
    const product = loadProduct(productId);
    
    if (!product) {
      console.error("Không tìm thấy sản phẩm với ID:", productId);
      // Hiển thị thông báo lỗi cho người dùng
      const productContainer = document.querySelector('.product-container');
      if (productContainer) {
        productContainer.innerHTML = `
          <div style="text-align: center; padding: 60px 20px;">
            <h2 style="color: #dc3545; margin-bottom: 20px;">Sản phẩm không tồn tại</h2>
            <p style="font-size: 16px; color: #666; margin-bottom: 30px;">Sản phẩm với ID "${productId}" không được tìm thấy trong hệ thống.</p>
            <a href="index.html" style="display: inline-block; padding: 12px 30px; background-color: #007bff; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">Về trang chủ</a>
          </div>
        `;
      }
      return;
    }
    
    // Render các phần
    renderProductImages(product);
    renderProductInfo(product);
    renderSpecifications(product);
    setupBuyButton(product);
    
    // Cập nhật title trang
    document.title = `${product.name} - Chi tiết sản phẩm`;
    
    console.log('✅ Đã render chi tiết sản phẩm:', product.name);
  }
  
  // Khởi tạo khi DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderProductDetail);
  } else {
    renderProductDetail();
  }
})();

