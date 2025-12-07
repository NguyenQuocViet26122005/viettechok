// File kiểm tra trạng thái đăng nhập và xử lý UI
(function() {
  'use strict';
  
  // Kiểm tra xem người dùng đã đăng nhập chưa
  function isUserLoggedIn() {
    try {
      const currentUserStr = localStorage.getItem('currentUser');
      if (!currentUserStr) return false;
      
      const currentUser = JSON.parse(currentUserStr);
      // Chỉ chấp nhận user (không phải admin)
      return currentUser && currentUser.role === 'user';
    } catch (e) {
      return false;
    }
  }
  
  // Cập nhật link icon người dùng và ẩn dropdown menu
  function updateUserLink() {
    const userLink = document.getElementById('userLink');
    const userDropdown = document.getElementById('userDropdown');
    const userDisplay = document.getElementById('userDisplay');
    
    if (!userLink) {
      // Nếu chưa có userLink, thử lại sau một chút
      setTimeout(updateUserLink, 100);
      return;
    }
    
    const loggedIn = isUserLoggedIn();
    
    if (loggedIn) {
      // Đã đăng nhập: link đến trang tài khoản
      userLink.href = 'Taikhoan.html';
      // Hiển thị dropdown menu
      if (userDropdown) {
        userDropdown.style.display = '';
        userDropdown.style.visibility = '';
      }
    } else {
      // Chưa đăng nhập: link đến trang đăng nhập (QUAN TRỌNG)
      userLink.href = 'Dangnhap.html';
      // Đảm bảo userLink có thể click được
      userLink.style.pointerEvents = 'auto';
      userLink.style.cursor = 'pointer';
      // Ẩn dropdown menu
      if (userDropdown) {
        userDropdown.style.display = 'none';
        userDropdown.style.visibility = 'hidden';
        userDropdown.style.pointerEvents = 'none';
      }
    }
  }
  
  // Kiểm tra đăng nhập trước khi thêm vào giỏ hàng
  function checkLoginBeforeAddToCart(callback) {
    if (!isUserLoggedIn()) {
      alert('⚠️ Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
      window.location.href = 'Dangnhap.html';
      return false;
    }
    
    if (typeof callback === 'function') {
      callback();
    }
    return true;
  }
  
  // Export functions để sử dụng ở các file khác
  window.authCheck = {
    isUserLoggedIn: isUserLoggedIn,
    checkLoginBeforeAddToCart: checkLoginBeforeAddToCart
  };
  
  // Chạy khi DOM ready và sau khi tất cả script khác chạy
  function init() {
    updateUserLink();
    // Chạy lại sau một chút để đảm bảo không bị override bởi code khác
    setTimeout(updateUserLink, 200);
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Lắng nghe thay đổi trong localStorage để cập nhật lại khi đăng nhập/đăng xuất
  window.addEventListener('storage', function(e) {
    if (e.key === 'currentUser') {
      updateUserLink();
    }
  });
})();

