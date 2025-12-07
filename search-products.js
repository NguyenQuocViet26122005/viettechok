// Chức năng tìm kiếm sản phẩm
(function() {
  'use strict';
  
  const LS_KEY = "laptop_admin_data_v1";
  let searchTimeout = null;
  
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
  
  // Format giá tiền
  function formatPrice(price) {
    return new Intl.NumberFormat("vi-VN").format(price || 0);
  }
  
  // Tạo HTML cho kết quả tìm kiếm
  function createSearchResultHTML(product) {
    const discount = product.oldPrice && product.oldPrice > product.price
      ? Math.round((1 - product.price / product.oldPrice) * 100)
      : 0;
    
    return `
      <div class="search-result-item" data-product-id="${product.id}">
        <img src="${product.mainImage || product.images?.[0] || 'anh/no-image.png'}" 
             alt="${product.name}" 
             onerror="this.src='anh/no-image.png'">
        <div class="search-result-info">
          <h4>${product.name}</h4>
          <p class="search-result-brand">${product.brand || ''}</p>
          <div class="search-result-price">
            <span class="price">${formatPrice(product.price)} đ</span>
            ${product.oldPrice && product.oldPrice > product.price 
              ? `<span class="old-price">${formatPrice(product.oldPrice)} đ</span>` 
              : ''}
            ${discount > 0 ? `<span class="discount-badge">-${discount}%</span>` : ''}
          </div>
        </div>
      </div>
    `;
  }
  
  // Hiển thị kết quả tìm kiếm
  function displaySearchResults(results, container) {
    if (!container) return;
    
    if (results.length === 0) {
      container.innerHTML = '<div class="search-result-empty">Không tìm thấy sản phẩm nào</div>';
      container.style.display = 'block';
      return;
    }
    
    // Giới hạn hiển thị 10 kết quả đầu tiên
    const limitedResults = results.slice(0, 10);
    container.innerHTML = limitedResults.map(createSearchResultHTML).join('');
    container.style.display = 'block';
    
    // Thêm event listener cho các kết quả
    container.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', function() {
        const productId = this.getAttribute('data-product-id');
        if (productId) {
          window.location.href = `product-detail.html?id=${productId}`;
        }
      });
    });
    
    // Nếu có nhiều hơn 10 kết quả, thêm nút "Xem tất cả"
    if (results.length > 10) {
      const viewAllBtn = document.createElement('div');
      viewAllBtn.className = 'search-result-view-all';
      viewAllBtn.textContent = `Xem tất cả ${results.length} kết quả (hiển thị 10/${results.length})`;
      viewAllBtn.style.cursor = 'default';
      viewAllBtn.style.color = '#666';
      container.appendChild(viewAllBtn);
    }
  }
  
  // Xử lý tìm kiếm
  function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    const resultsContainer = document.getElementById('searchResults');
    
    if (!searchInput || !resultsContainer) return;
    
    const query = searchInput.value.trim();
    
    // Xóa timeout cũ nếu có
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Nếu query rỗng, ẩn kết quả
    if (query.length === 0) {
      resultsContainer.style.display = 'none';
      return;
    }
    
    // Đợi 300ms sau khi người dùng ngừng gõ để tìm kiếm
    searchTimeout = setTimeout(() => {
      const results = searchProducts(query);
      displaySearchResults(results, resultsContainer);
    }, 300);
  }
  
  // Xử lý khi click vào nút tìm kiếm
  function handleSearchButtonClick() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    const query = searchInput.value.trim();
    
    if (query.length === 0) {
      alert('Vui lòng nhập từ khóa tìm kiếm');
      return;
    }
    
    // Lưu query và chuyển đến trang kết quả
    localStorage.setItem('searchQuery', query);
    window.location.href = 'search-results.html';
  }
  
  // Xử lý khi nhấn Enter
  function handleSearchKeyPress(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearchButtonClick();
    }
  }
  
  // Ẩn kết quả khi click ra ngoài
  function hideResultsOnClickOutside(event) {
    const searchBarContainer = document.getElementById('searchBarContainer');
    const resultsContainer = document.getElementById('searchResults');
    
    if (!searchBarContainer || !resultsContainer) return;
    
    if (!searchBarContainer.contains(event.target)) {
      resultsContainer.style.display = 'none';
    }
  }
  
  // Khởi tạo
  function init() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    
    if (!searchInput) {
      // Nếu chưa có searchInput, thử lại sau một chút
      setTimeout(init, 100);
      return;
    }
    
    // Event listeners
    searchInput.addEventListener('input', handleSearch);
    searchInput.addEventListener('focus', function() {
      const query = this.value.trim();
      if (query.length > 0) {
        const results = searchProducts(query);
        const resultsContainer = document.getElementById('searchResults');
        if (resultsContainer) {
          displaySearchResults(results, resultsContainer);
        }
      }
    });
    
    if (searchButton) {
      searchButton.addEventListener('click', handleSearchButtonClick);
    }
    
    searchInput.addEventListener('keypress', handleSearchKeyPress);
    
    // Ẩn kết quả khi click ra ngoài
    document.addEventListener('click', hideResultsOnClickOutside);
  }
  
  // Chạy khi DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

