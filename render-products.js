// Script để render sản phẩm từ admin lên trang bán
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
    // Tính oldPrice nếu có discount hoặc có thể tính từ price
    let oldPrice = product.oldPrice;
    let discount = 0;
    
    if (oldPrice && oldPrice > product.price) {
      discount = calculateDiscount(product.price, oldPrice);
    } else if (product.discount && product.discount > 0) {
      // Nếu có discount %, tính oldPrice
      discount = product.discount;
      oldPrice = Math.round(product.price / (1 - discount / 100));
    }
    
    const image = product.mainImage || (product.images && product.images[0]) || "anh/no-image.png";
    // Link đến file chi tiết sản phẩm chung với ID
    const productUrl = `product-detail.html?id=${product.id}`;
    const badge = product.status === "active" ? '<div class="badge">sản phẩm HOT !!!</div>' : '';
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
  
  // Render sản phẩm vào container
  function renderProducts(containerSelector, products, maxProducts = null) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    
    let productsToShow = products.filter(p => p.status === "active");
    
    if (maxProducts) {
      productsToShow = productsToShow.slice(0, maxProducts);
    }
    
    if (productsToShow.length === 0) {
      container.innerHTML = '<p style="text-align: center; padding: 20px;">Chưa có sản phẩm nào.</p>';
      return;
    }
    
    container.innerHTML = productsToShow.map(createProductHTML).join('');
  }
  
  // Load và render sản phẩm
  function loadAndRenderProducts() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) {
        console.log("Chưa có dữ liệu sản phẩm từ admin - giữ nguyên sản phẩm tĩnh");
        return;
      }
      
      const data = JSON.parse(raw);
      const products = data.products || [];
      
      if (products.length === 0) {
        console.log("Không có sản phẩm nào từ admin - giữ nguyên sản phẩm tĩnh");
        return;
      }
      
      // KHÔNG render vào section "GIỜ VÀNG GIÁ SỐC" - giữ nguyên sản phẩm tĩnh ở đó
      
      // Render vào section "MÁY TÍNH XÁCH TAY" - tất cả sản phẩm
      const allLaptopSections = document.querySelectorAll('section.laptops');
      allLaptopSections.forEach(section => {
        const header = section.querySelector('.laptops-header h2');
        const productsContainer = section.querySelector('.laptop-products');
        
        if (header && productsContainer) {
          const headerText = header.textContent.trim();
          
          if (headerText.includes('MÁY TÍNH XÁCH TAY')) {
            // Lấy danh sách ID sản phẩm đã có trong container
            const existingProductIds = new Set();
            productsContainer.querySelectorAll('.product[data-product-id]').forEach(productEl => {
              const productId = productEl.getAttribute('data-product-id');
              if (productId) {
                existingProductIds.add(productId);
              }
            });
            
            // Chỉ thêm các sản phẩm mới chưa có trong container
            const activeProducts = products.filter(p => p.status === "active");
            const newProducts = activeProducts.filter(p => !existingProductIds.has(p.id));
            
            if (newProducts.length > 0) {
              // Thêm sản phẩm mới vào cuối container
              const newProductsHTML = newProducts.map(createProductHTML).join('');
              productsContainer.insertAdjacentHTML('beforeend', newProductsHTML);
              console.log(`✅ Đã thêm ${newProducts.length} sản phẩm mới vào "MÁY TÍNH XÁCH TAY"`);
            }
          } else if (headerText.includes('LENOVO')) {
            // Render chỉ sản phẩm Lenovo
            const lenovoProducts = products.filter(p => {
              if (p.status !== "active") return false;
              const name = (p.name || '').toLowerCase();
              const brand = (p.brand || '').toLowerCase();
              const category = (p.category || '').toLowerCase();
              return name.includes('lenovo') || name.includes('ideapad') || 
                     brand.includes('lenovo') || category.includes('lenovo');
            });
            
            if (lenovoProducts.length > 0) {
              // Lấy danh sách ID sản phẩm đã có trong container
              const existingProductIds = new Set();
              productsContainer.querySelectorAll('.product[data-product-id]').forEach(productEl => {
                const productId = productEl.getAttribute('data-product-id');
                if (productId) {
                  existingProductIds.add(productId);
                }
              });
              
              // Chỉ thêm các sản phẩm mới chưa có trong container
              const newLenovoProducts = lenovoProducts.filter(p => !existingProductIds.has(p.id));
              
              if (newLenovoProducts.length > 0) {
                // Thêm sản phẩm mới vào cuối container
                const newProductsHTML = newLenovoProducts.map(createProductHTML).join('');
                productsContainer.insertAdjacentHTML('beforeend', newProductsHTML);
                console.log(`✅ Đã thêm ${newLenovoProducts.length} sản phẩm Lenovo mới`);
              }
            }
          }
        }
      });
      
      console.log(`✅ Đã render ${products.length} sản phẩm từ admin lên trang bán`);
    } catch (error) {
      console.error("❌ Lỗi khi load sản phẩm:", error);
    }
  }
  
  // Lắng nghe thay đổi từ admin
  function setupProductUpdateListener() {
    // BroadcastChannel để nhận thông báo từ admin
    const channel = new BroadcastChannel('product-updates');
    channel.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'products-updated') {
        console.log("Nhận thông báo cập nhật sản phẩm từ admin");
        loadAndRenderProducts();
      }
    });
    
    // Storage event để nhận thông báo khi localStorage thay đổi (từ tab khác)
    window.addEventListener('storage', (e) => {
      if (e.key === LS_KEY || e.key === 'laptop_admin_products_update_time') {
        console.log("Nhận thông báo cập nhật sản phẩm từ tab khác");
        loadAndRenderProducts();
      }
    });
    
    // Polling để kiểm tra thay đổi trong cùng tab
    let lastUpdateTime = localStorage.getItem('laptop_admin_products_update_time');
    setInterval(() => {
      const currentUpdateTime = localStorage.getItem('laptop_admin_products_update_time');
      if (currentUpdateTime && currentUpdateTime !== lastUpdateTime) {
        lastUpdateTime = currentUpdateTime;
        console.log("Phát hiện thay đổi sản phẩm (polling)");
        loadAndRenderProducts();
      }
    }, 1000); // Kiểm tra mỗi giây
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

