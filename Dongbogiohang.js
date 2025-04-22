document.addEventListener("DOMContentLoaded", () => {
    const cartCountElement = document.getElementById("cartCount");
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.textContent = totalQuantity;
});