// Script để hiển thị kết quả tìm kiếm trên trang search-results.html
(function() {
  'use strict';
  
  const LS_KEY = "laptop_admin_data_v1";
  
  // Load sản phẩm từ localStorage
  function loadProducts() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return [];
      
      const data = JSON.parse(raw);
      return (data.products || []).filter(p => p.status === 'active');
    } catch (e) {
      console.error("Lỗi đọc dữ liệu sản phẩm:", e);
      return [];
    }
  }
  
  // Tìm kiếm sản phẩm
  function searchProducts(query) {
    if (!query || query.trim().length === 0) {
      return [];
    }
    
    const products = loadProducts();
    const searchTerm = query.toLowerCase().trim();
    
    return products.filter(product => {
      // Tìm kiếm theo nhiều tiêu chí
      const name = (product.name || '').toLowerCase();
      const brand = (product.brand || '').toLowerCase();
      const category = (product.category || '').toLowerCase();
      const description = (product.description || '').toLowerCase();
      const cpu = (product.cpu || '').toLowerCase();
      const ram = (product.ram || '').toLowerCase();
      const storage = (product.storage || '').toLowerCase();
      const gpu = (product.gpu || '').toLowerCase();
      const screen = (product.screen || '').toLowerCase();
      
      return name.includes(searchTerm) ||
             brand.includes(searchTerm) ||
             category.includes(searchTerm) ||
             description.includes(searchTerm) ||
             cpu.includes(searchTerm) ||
             ram.includes(searchTerm) ||
             storage.includes(searchTerm) ||
             gpu.includes(searchTerm) ||
             screen.includes(searchTerm);
    });
  }
  
  // Format giá tiền (giống các trang khác - không có "đ", chỉ số với dấu chấm)
  function formatPrice(price) {
    return new Intl.NumberFormat("vi-VN").format(price || 0).replace(/\s/g, '.');
  }
  
  // Tạo HTML cho sản phẩm (giống các trang khác)
  function createProductHTML(product) {
    const discount = product.oldPrice && product.oldPrice > product.price
      ? Math.round((1 - product.price / product.oldPrice) * 100)
      : 0;
    
    // Format giá không có "đ" ở cuối, chỉ có số
    const priceFormatted = formatPrice(product.price).replace(/\s/g, '.');
    const oldPriceFormatted = product.oldPrice && product.oldPrice > product.price
      ? formatPrice(product.oldPrice).replace(/\s/g, '.')
      : '';
    
    return `
      <div class="product">
        <a href="product-detail.html?id=${product.id}" class="product-link">
          <div class="badge">Sản phẩm HOT !!!</div>
          ${discount > 0 ? `<div class="discount">-${discount}%</div>` : ''}
          <img src="${product.mainImage || product.images?.[0] || 'anh/no-image.png'}" 
               alt="${product.name}" 
               onerror="this.src='anh/no-image.png'">
          <h3>${product.name}</h3>
          <p class="price">
            ${priceFormatted}
            ${oldPriceFormatted ? `<span class="old-price">${oldPriceFormatted}</span>` : ''}
          </p>
        </a>
      </div>
    `;
  }
  
  // Hiển thị kết quả tìm kiếm
  function displaySearchResults() {
    const query = localStorage.getItem('searchQuery') || '';
    const resultsContainer = document.getElementById('searchResultsContainer');
    const resultsTitle = document.getElementById('searchResultsTitle');
    const resultsCount = document.getElementById('searchResultsCount');
    
    if (!resultsContainer) return;
    
    // Cập nhật giá trị trong ô tìm kiếm
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.value = query;
    }
    
    if (!query || query.trim().length === 0) {
      resultsTitle.textContent = 'Kết quả tìm kiếm';
      resultsCount.textContent = 'Vui lòng nhập từ khóa tìm kiếm';
      resultsContainer.innerHTML = '<p style="text-align: center; padding: 40px; color: #999;">Chưa có từ khóa tìm kiếm</p>';
      return;
    }
    
    const results = searchProducts(query);
    
    // Cập nhật tiêu đề và số lượng
    resultsTitle.textContent = `Kết quả tìm kiếm cho "${query}"`;
    resultsCount.textContent = `Tìm thấy ${results.length} sản phẩm`;
    
    if (results.length === 0) {
      resultsContainer.innerHTML = `
        <div style="text-align: center; padding: 60px 20px;">
          <i class="fa fa-search" style="font-size: 64px; color: #ddd; margin-bottom: 20px;"></i>
          <h3 style="color: #666; margin-bottom: 10px;">Không tìm thấy sản phẩm nào</h3>
          <p style="color: #999;">Vui lòng thử lại với từ khóa khác</p>
        </div>
      `;
      return;
    }
    
    // Hiển thị tất cả kết quả
    resultsContainer.innerHTML = results.map(createProductHTML).join('');
  }
  
  // Khởi tạo
  function init() {
    displaySearchResults();
    
    // Xử lý khi nhấn Enter trong ô tìm kiếm
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    
    if (searchInput) {
      searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          const query = this.value.trim();
          if (query.length > 0) {
            localStorage.setItem('searchQuery', query);
            displaySearchResults();
          }
        }
      });
    }
    
    if (searchButton) {
      searchButton.addEventListener('click', function() {
        const query = searchInput ? searchInput.value.trim() : '';
        if (query.length > 0) {
          localStorage.setItem('searchQuery', query);
          displaySearchResults();
        }
      });
    }
  }
  
  // Chạy khi DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

