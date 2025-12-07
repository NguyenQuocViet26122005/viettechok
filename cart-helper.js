// Helper functions để quản lý giỏ hàng theo từng tài khoản
(function() {
  'use strict';
  
  // Lấy userId từ currentUser
  function getCurrentUserId() {
    try {
      const currentUserStr = localStorage.getItem('currentUser');
      if (!currentUserStr) return null;
      
      const currentUser = JSON.parse(currentUserStr);
      // Dùng email hoặc id làm userId
      return currentUser.email || currentUser.id || null;
    } catch (e) {
      return null;
    }
  }
  
  // Lấy key giỏ hàng cho user hiện tại
  function getCartKey() {
    const userId = getCurrentUserId();
    if (!userId) {
      // Nếu chưa đăng nhập, dùng cart tạm thời
      return 'cart_guest';
    }
    return `cart_${userId}`;
  }
  
  // Lấy giỏ hàng của user hiện tại
  function getCart() {
    const cartKey = getCartKey();
    try {
      const cartStr = localStorage.getItem(cartKey);
      return cartStr ? JSON.parse(cartStr) : [];
    } catch (e) {
      console.error('Lỗi đọc giỏ hàng:', e);
      return [];
    }
  }
  
  // Lưu giỏ hàng của user hiện tại
  function saveCart(cart) {
    const cartKey = getCartKey();
    try {
      localStorage.setItem(cartKey, JSON.stringify(cart));
      // Cập nhật số lượng giỏ hàng trên icon
      updateCartCount();
      return true;
    } catch (e) {
      console.error('Lỗi lưu giỏ hàng:', e);
      return false;
    }
  }
  
  // Xóa giỏ hàng của user hiện tại
  function clearCart() {
    const cartKey = getCartKey();
    try {
      localStorage.removeItem(cartKey);
      updateCartCount();
      return true;
    } catch (e) {
      console.error('Lỗi xóa giỏ hàng:', e);
      return false;
    }
  }
  
  // Cập nhật số lượng giỏ hàng trên icon
  function updateCartCount() {
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
      const cart = getCart();
      const totalQuantity = cart.reduce((total, item) => total + (item.quantity || 0), 0);
      cartCountElement.textContent = totalQuantity;
    }
  }
  
  // Load giỏ hàng khi đăng nhập
  function loadUserCart(userId) {
    const cartKey = `cart_${userId}`;
    try {
      const cartStr = localStorage.getItem(cartKey);
      return cartStr ? JSON.parse(cartStr) : [];
    } catch (e) {
      console.error('Lỗi load giỏ hàng:', e);
      return [];
    }
  }
  
  // Xóa giỏ hàng guest khi đăng nhập (chuyển sang user cart)
  function migrateGuestCartToUser(userId) {
    const guestCartKey = 'cart_guest';
    const userCartKey = `cart_${userId}`;
    
    try {
      // Lấy giỏ hàng guest
      const guestCartStr = localStorage.getItem(guestCartKey);
      if (!guestCartStr) return;
      
      const guestCart = JSON.parse(guestCartStr);
      
      // Lấy giỏ hàng user hiện tại
      const userCartStr = localStorage.getItem(userCartKey);
      const userCart = userCartStr ? JSON.parse(userCartStr) : [];
      
      // Merge giỏ hàng: thêm sản phẩm từ guest vào user (tránh trùng)
      guestCart.forEach(guestItem => {
        const existingItem = userCart.find(item => item.id === guestItem.id);
        if (existingItem) {
          existingItem.quantity += guestItem.quantity;
        } else {
          userCart.push(guestItem);
        }
      });
      
      // Lưu giỏ hàng user
      localStorage.setItem(userCartKey, JSON.stringify(userCart));
      
      // Xóa giỏ hàng guest
      localStorage.removeItem(guestCartKey);
      
      // Cập nhật số lượng
      updateCartCount();
    } catch (e) {
      console.error('Lỗi migrate giỏ hàng:', e);
    }
  }
  
  // Export functions
  window.cartHelper = {
    getCart: getCart,
    saveCart: saveCart,
    clearCart: clearCart,
    updateCartCount: updateCartCount,
    loadUserCart: loadUserCart,
    migrateGuestCartToUser: migrateGuestCartToUser,
    getCurrentUserId: getCurrentUserId
  };
  
  // Cập nhật số lượng khi DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateCartCount);
  } else {
    updateCartCount();
  }
  
  // Lắng nghe thay đổi trong localStorage để cập nhật lại khi đăng nhập/đăng xuất
  window.addEventListener('storage', function(e) {
    if (e.key === 'currentUser') {
      updateCartCount();
    }
  });
})();

