// Script để render sản phẩm "APPLE" từ admin
(function() {
  const LS_KEY = "laptop_admin_data_v1";
  
  // Format giá tiền
  function formatPrice(price) {
    return new Intl.NumberFormat("vi-VN").format(price || 0);
  }
  
  // Tính phần trăm giảm giá
  function calculateDiscount(price, oldPrice) {
    if (!oldPrice || oldPrice <= price) return 0;
    return Math.round((1 - price / oldPrice) * 100);
  }
  
  // Tạo HTML cho một sản phẩm
  function createProductHTML(product) {
    let oldPrice = product.oldPrice;
    let discount = 0;
    
    if (oldPrice && oldPrice > product.price) {
      discount = calculateDiscount(product.price, oldPrice);
    } else if (product.discount && product.discount > 0) {
      discount = product.discount;
      oldPrice = Math.round(product.price / (1 - discount / 100));
    }
    
    const image = product.mainImage || (product.images && product.images[0]) || "anh/no-image.png";
    const productUrl = `product-detail.html?id=${product.id}`;
    const badge = product.status === "active" ? '<div class="badge">Sản phẩm HOT !!!</div>' : '';
    const discountBadge = discount > 0 ? `<div class="discount">-${discount}%</div>` : '';
    const oldPriceHTML = oldPrice && oldPrice > product.price ? `<span class="old-price">${formatPrice(oldPrice)}</span>` : '';
    
    return `
      <div class="product" data-product-id="${product.id}">
        <a href="${productUrl}" class="product-link">
          ${badge}
          ${discountBadge}
          <img src="${image}" alt="${product.name || 'Sản phẩm'}" onerror="this.src='anh/no-image.png'">
          <h3>${product.name || 'Chưa có tên'}</h3>
          <p class="price">${formatPrice(product.price || 0)} ${oldPriceHTML}</p>
        </a>
      </div>
    `;
  }
  
  // Load và render sản phẩm "APPLE"
  function loadAndRenderProducts() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) {
        console.log("Chưa có dữ liệu sản phẩm từ admin");
        return;
      }
      
      const data = JSON.parse(raw);
      const products = data.products || [];
      
      if (products.length === 0) {
        console.log("Không có sản phẩm nào từ admin");
        return;
      }
      
      // Lọc sản phẩm Apple (Macbook, iPad, iPhone)
      const appleProducts = products.filter(p => {
        if (p.status !== "active") return false;
        const name = (p.name || '').toLowerCase();
        const brand = (p.brand || '').toLowerCase();
        const category = (p.category || '').toLowerCase();
        
        return name.includes('apple') || name.includes('macbook') || name.includes('mac') ||
               name.includes('ipad') || name.includes('iphone') ||
               brand.includes('apple') || category.includes('apple');
      });
      
      const container = document.getElementById('appleProducts');
      if (!container) return;
      
      if (appleProducts.length === 0) {
        // Giữ nguyên sản phẩm tĩnh nếu không có sản phẩm từ admin
        console.log("Không có sản phẩm từ admin - giữ nguyên sản phẩm tĩnh");
        return;
      }
      
      // Lấy danh sách ID sản phẩm đã có trong container (sản phẩm tĩnh và sản phẩm từ admin đã render)
      const existingProductIds = new Set();
      container.querySelectorAll('.product[data-product-id]').forEach(productEl => {
        const productId = productEl.getAttribute('data-product-id');
        if (productId) {
          existingProductIds.add(productId);
        }
      });
      
      // Chỉ thêm các sản phẩm mới chưa có trong container
      const newProducts = appleProducts.filter(p => !existingProductIds.has(p.id));
      
      if (newProducts.length > 0) {
        // Thêm sản phẩm mới vào đầu container
        const newProductsHTML = newProducts.map(createProductHTML).join('');
        container.insertAdjacentHTML('afterbegin', newProductsHTML);
        console.log(`✅ Đã thêm ${newProducts.length} sản phẩm mới "APPLE" từ admin`);
      } else {
        console.log("Không có sản phẩm mới để thêm");
      }
    } catch (error) {
      console.error("❌ Lỗi khi load sản phẩm:", error);
    }
  }
  
  // Lắng nghe thay đổi từ admin
  function setupProductUpdateListener() {
    const channel = new BroadcastChannel('product-updates');
    channel.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'products-updated') {
        loadAndRenderProducts();
      }
    });
    
    window.addEventListener('storage', (e) => {
      if (e.key === LS_KEY || e.key === 'laptop_admin_products_update_time') {
        loadAndRenderProducts();
      }
    });
    
    let lastUpdateTime = localStorage.getItem('laptop_admin_products_update_time');
    setInterval(() => {
      const currentUpdateTime = localStorage.getItem('laptop_admin_products_update_time');
      if (currentUpdateTime && currentUpdateTime !== lastUpdateTime) {
        lastUpdateTime = currentUpdateTime;
        loadAndRenderProducts();
      }
    }, 1000);
  }
  
  // Khởi tạo khi DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      loadAndRenderProducts();
      setupProductUpdateListener();
    });
  } else {
    loadAndRenderProducts();
    setupProductUpdateListener();
  }
})();

