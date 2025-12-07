document.addEventListener("DOMContentLoaded", () => {
    // Sử dụng cartHelper để lấy giỏ hàng theo user
    if (window.cartHelper) {
        window.cartHelper.updateCartCount();
    } else {
        // Fallback nếu cartHelper chưa load
        const cartCountElement = document.getElementById("cartCount");
        if (cartCountElement) {
            const cart = window.cartHelper ? window.cartHelper.getCart() : (JSON.parse(localStorage.getItem("cart")) || []);
            const totalQuantity = cart.reduce((total, item) => total + (item.quantity || 0), 0);
            cartCountElement.textContent = totalQuantity;
        }
    }
});