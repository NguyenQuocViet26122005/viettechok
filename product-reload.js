// File này được thêm vào các trang để tự động reload khi admin thay đổi sản phẩm
(function() {
    'use strict';
    
    // Kiểm tra xem có phải trang admin không (không cần reload)
    if (window.location.pathname.includes('admin.html')) {
        return;
    }
    
    const LS_KEY = 'laptop_admin_data_v1';
    const TIMESTAMP_KEY = 'laptop_admin_products_update_time';
    let lastUpdateTime = null;
    let isReloading = false;
    let initialized = false;
    
    // Khởi tạo timestamp ban đầu sau một chút delay để tránh reload ngay khi load trang
    setTimeout(function() {
        try {
            const savedTime = localStorage.getItem(TIMESTAMP_KEY);
            lastUpdateTime = savedTime ? parseInt(savedTime, 10) : Date.now();
            initialized = true;
            console.log('✅ Đã khởi tạo timestamp:', lastUpdateTime);
        } catch (e) {
            console.error('Lỗi khi đọc timestamp:', e);
            initialized = true;
        }
    }, 1000);
    
    // BroadcastChannel để lắng nghe thông báo từ admin (hoạt động giữa các tab)
    const broadcastChannel = new BroadcastChannel('product-updates');
    
    // Hàm reload trang
    function reloadPage() {
        if (isReloading) return;
        isReloading = true;
        console.log('🔄 Đang reload trang để cập nhật sản phẩm...');
        setTimeout(() => {
            window.location.reload();
        }, 300);
    }
    
    // Lắng nghe thông báo từ admin qua BroadcastChannel
    broadcastChannel.addEventListener('message', function(event) {
        if (event.data && event.data.type) {
            console.log('📢 Nhận thông báo cập nhật sản phẩm:', event.data.type);
            if (event.data.timestamp) {
                lastUpdateTime = event.data.timestamp;
            }
            reloadPage();
        }
    });
    
    // Lắng nghe storage event (chỉ hoạt động giữa các tab khác nhau)
    window.addEventListener('storage', function(event) {
        if (event.key === TIMESTAMP_KEY && event.newValue) {
            const newTime = parseInt(event.newValue, 10);
            if (newTime && newTime !== lastUpdateTime) {
                console.log('📦 Phát hiện thay đổi timestamp từ tab khác:', newTime);
                lastUpdateTime = newTime;
                reloadPage();
            }
        } else if (event.key === LS_KEY && event.newValue) {
            console.log('📦 Phát hiện thay đổi localStorage từ tab khác');
            reloadPage();
        }
    });
    
    // Polling để kiểm tra thay đổi trong cùng tab (mỗi 500ms để nhanh hơn)
    setInterval(function() {
        if (!initialized) return; // Chờ đến khi đã khởi tạo xong
        
        try {
            const currentTime = localStorage.getItem(TIMESTAMP_KEY);
            if (currentTime) {
                const timeValue = parseInt(currentTime, 10);
                if (timeValue && lastUpdateTime !== null && timeValue > lastUpdateTime) {
                    console.log('⏰ Phát hiện thay đổi timestamp:', timeValue, 'vs', lastUpdateTime);
                    lastUpdateTime = timeValue;
                    reloadPage();
                }
            }
        } catch (e) {
            console.error('Lỗi khi kiểm tra timestamp:', e);
        }
    }, 500);
    
    console.log('✅ Đã kích hoạt tự động reload khi admin thay đổi sản phẩm');
})();

