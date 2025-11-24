// clientProducts.js
const LS_KEY = "laptop_admin_data_v1";

function loadAdminState() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return { products: [], orders: [] };
    return JSON.parse(raw);
  } catch (e) {
    console.error("Không đọc được dữ liệu admin:", e);
    return { products: [], orders: [] };
  }
}

function formatMoney(n) {
  return n.toLocaleString("vi-VN") + "₫";
}

function createProductCard(p) {
  // dùng thumbnail nếu có, không có thì lấy ảnh đầu tiên trong p.images,
  // cuối cùng fallback ra 1 ảnh placeholder
  const thumb =
    (p.thumbnail) ||
    (p.images && p.images[0]) ||
    "anh/laptop1.png";

  return `
    <div class="product">
      <a href="Sanpham1.html" class="product-link">
        <div class="badge">${p.category || "Laptop"}</div>
        <img src="${thumb}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p class="price">
          ${formatMoney(p.price)}
        </p>
      </a>
    </div>
  `;
}

function renderAdminProductsForIndex() {
  const state = loadAdminState();
  const container = document.getElementById("indexAdminList");
  if (!container) return;

  const activeProducts = state.products.filter(
    (p) => p.status === "active"
  );

  if (!activeProducts.length) {
    container.innerHTML = "<p>Chưa có sản phẩm nào trong admin.</p>";
    return;
  }

  container.innerHTML = activeProducts.map(createProductCard).join("");
}

function renderAdminProductsForLenovo() {
  const state = loadAdminState();
  const container = document.getElementById("lenovoAdminList");
  if (!container) return;

  const lenovoProducts = state.products.filter(
    (p) =>
      p.status === "active" &&
      p.brand &&
      p.brand.toLowerCase().includes("lenovo")
  );

  if (!lenovoProducts.length) {
    container.innerHTML = "<p>Chưa có sản phẩm Lenovo nào trong admin.</p>";
    return;
  }

  container.innerHTML = lenovoProducts.map(createProductCard).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  renderAdminProductsForIndex();
  renderAdminProductsForLenovo();
});
