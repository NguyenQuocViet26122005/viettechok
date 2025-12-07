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
  
  // Kiểm tra xem có phải admin không
  function isAdminLoggedIn() {
    try {
      const isAdmin = localStorage.getItem('isAdmin') === 'true';
      const currentUserStr = localStorage.getItem('currentUser');
      if (currentUserStr) {
        const currentUser = JSON.parse(currentUserStr);
        return isAdmin || (currentUser && currentUser.role === 'admin');
      }
      return isAdmin;
    } catch (e) {
      return false;
    }
  }
  
  // Hiển thị tên người dùng (cả user và admin)
  function displayUserName() {
    const userLink = document.getElementById('userLink');
    const userDropdown = document.getElementById('userDropdown');
    
    if (!userLink) return;
    
    try {
      const currentUserStr = localStorage.getItem('currentUser');
      const isAdmin = isAdminLoggedIn();
      
      if (currentUserStr) {
        const currentUser = JSON.parse(currentUserStr);
        // Hiển thị cho cả user và admin
        if (currentUser.name && (currentUser.role === 'user' || currentUser.role === 'admin' || isAdmin)) {
          // Hiển thị banner với "Xin chào" + tên
          userLink.innerHTML = `
            <i class="fa fa-user"></i>
            <div class="user-greeting">
              <div class="greeting-text">Xin chào</div>
              <div class="user-name">${currentUser.name}</div>
            </div>
          `;
          userLink.classList.add('user-logged-in');
          userLink.style.textDecoration = 'none';
          
          // Nếu là admin, link đến trang admin
          if (isAdmin || currentUser.role === 'admin') {
            userLink.href = 'admin.html';
          } else {
            userLink.href = 'Taikhoan.html';
          }
          
          // Hiển thị dropdown menu
          if (userDropdown) {
            userDropdown.style.display = '';
            userDropdown.style.visibility = '';
          }
        }
      }
    } catch (e) {
      console.error("Lỗi đọc thông tin người dùng:", e);
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
    const isAdmin = isAdminLoggedIn();
    
    if (loggedIn || isAdmin) {
      // Đã đăng nhập: hiển thị tên người dùng
      displayUserName();
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
    isAdminLoggedIn: isAdminLoggedIn,
    displayUserName: displayUserName,
    checkLoginBeforeAddToCart: checkLoginBeforeAddToCart
  };
  
  // Chạy khi DOM ready và sau khi tất cả script khác chạy
  function init() {
    updateUserLink();
    displayUserName();
    // Chạy lại sau một chút để đảm bảo không bị override bởi code khác
    setTimeout(() => {
      updateUserLink();
      displayUserName();
    }, 200);
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

