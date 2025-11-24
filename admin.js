// ======= Utilities =======
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

const toast = (msg) => {
  const t = $("#toast");
  $("#toastMessage").textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2500);
};

const money = (n) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(n || 0);

// ======= State (in-memory + localStorage) =======
const LS_KEY = "laptop_admin_data_v1";
// Các trang khác (index, trang sản phẩm) có thể đọc dữ liệu này từ localStorage.

let state = {
  products: [],
  orders: [],
};

function loadState() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      state = JSON.parse(raw);
    } else {
      seedSample();
    }
  } catch {
    seedSample();
  }
}

function saveState() {
  localStorage.setItem(LS_KEY, JSON.stringify(state));
}

function seedSample() {
  state.products = [
    {
      id: "P001",
      name: "Dell XPS 13 Plus",
      brand: "Dell",
      category: "Văn phòng",
      price: 28500000,
      stock: 15,
      cpu: "Intel Core i7-1260P",
      ram: "16GB LPDDR5",
      storage: "512GB SSD",
      gpu: "Intel Iris Xe",
      screen: '13.4" 3.5K OLED',
      status: "active",
      mainImage: "images/dell-xps-1.jpg",
      images: [
        "images/dell-xps-1.jpg",
        "images/dell-xps-2.jpg",
        "images/dell-xps-3.jpg",
        "images/dell-xps-4.jpg",
        "images/dell-xps-5.jpg",
      ],
    },
    {
      id: "P002",
      name: 'MacBook Pro 14"',
      brand: "Apple",
      category: "Đồ họa",
      price: 52990000,
      stock: 8,
      cpu: "Apple M2 Pro",
      ram: "16GB",
      storage: "512GB SSD",
      gpu: "M2 Pro GPU",
      screen: '14.2" XDR',
      status: "active",
      mainImage: "images/mbp14-1.jpg",
      images: [
        "images/mbp14-1.jpg",
        "images/mbp14-2.jpg",
        "images/mbp14-3.jpg",
        "images/mbp14-4.jpg",
        "images/mbp14-5.jpg",
      ],
    },
    {
      id: "P003",
      name: "ASUS ROG Strix G15",
      brand: "Asus",
      category: "Gaming",
      price: 32990000,
      stock: 12,
      cpu: "Ryzen 7 6800H",
      ram: "16GB DDR5",
      storage: "1TB SSD",
      gpu: "RTX 3070",
      screen: '15.6" 144Hz',
      status: "active",
      mainImage: "images/rog-g15-1.jpg",
      images: [
        "images/rog-g15-1.jpg",
        "images/rog-g15-2.jpg",
        "images/rog-g15-3.jpg",
        "images/rog-g15-4.jpg",
        "images/rog-g15-5.jpg",
      ],
    },
  ];

  state.orders = [
    {
      id: "ORD001",
      customerName: "Nguyễn Văn An",
      customerEmail: "an.nguyen@email.com",
      customerPhone: "0901234567",
      productName: "Dell XPS 13 Plus",
      totalAmount: 28500000,
      status: "completed",
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: "ORD002",
      customerName: "Trần Thị Bình",
      customerEmail: "binh.tran@email.com",
      customerPhone: "0912345678",
      productName: 'MacBook Pro 14"',
      totalAmount: 52990000,
      status: "shipping",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "ORD003",
      customerName: "Lê Minh Cường",
      customerEmail: "cuong.le@email.com",
      customerPhone: "0923456789",
      productName: "ASUS ROG Strix G15",
      totalAmount: 32990000,
      status: "processing",
      createdAt: new Date().toISOString(),
    },
  ];

  saveState();
}

// ======= Sidebar routing =======
function activateSection(id) {
  $$(".section").forEach((s) => s.classList.add("is-hidden"));
  $("#" + id).classList.remove("is-hidden");
  $$(".menu__item").forEach((b) => b.classList.remove("active"));
  const btn = $(`.menu__item[data-target="${id}"]`);
  if (btn) btn.classList.add("active");

  if (window.innerWidth <= 960) $("#sidebar").classList.remove("open");
}

function initSidebar() {
  $("#btnToggleSidebar").addEventListener("click", () => {
    $("#sidebar").classList.toggle("open");
  });
  $$(".menu__item").forEach((btn) =>
    btn.addEventListener("click", () => activateSection(btn.dataset.target))
  );
}

// ======= Dashboard =======
function renderDashboard() {
  const todayStr = new Date().toDateString();
  const ordersToday = state.orders.filter(
    (o) => new Date(o.createdAt).toDateString() === todayStr
  );
  const todayRevenue = ordersToday.reduce(
    (s, o) => s + (o.totalAmount || 0),
    0
  );
  const totalStock = state.products.reduce((s, p) => s + (p.stock || 0), 0);
  const pending = state.orders.filter((o) => o.status === "pending").length;

  $("#todayRevenue").textContent = money(todayRevenue);
  $("#newOrders").textContent = pending;
  $("#totalStock").textContent = totalStock;
  $("#totalCustomers").textContent = getCustomers().length;

  renderRevenueChart();
  renderTopProductsChart();
}

function renderRevenueChart() {
  const ctx = $("#revenueChart");
  if (!ctx) return;
  const labels = [];
  const revenues = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    labels.push(
      d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })
    );
    const dayRevenue = state.orders
      .filter((o) => new Date(o.createdAt).toDateString() === d.toDateString())
      .reduce((s, o) => s + (o.totalAmount || 0), 0);
    revenues.push(dayRevenue);
  }
  new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Doanh thu (VND)",
          data: revenues,
          borderColor: "#3b82f6",
          tension: 0.35,
        },
      ],
    },
    options: { responsive: true, scales: { y: { beginAtZero: true } } },
  });
}

function renderTopProductsChart() {
  const ctx = $("#topProductsChart");
  if (!ctx) return;
  const count = {};
  state.orders.forEach(
    (o) => (count[o.productName] = (count[o.productName] || 0) + 1)
  );
  const top = Object.entries(count)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: top.map((t) => t[0]),
      datasets: [
        {
          label: "Số lượng bán",
          data: top.map((t) => t[1]),
          backgroundColor: "#10b981",
        },
      ],
    },
    options: { responsive: true, scales: { y: { beginAtZero: true } } },
  });
}

// ======= Products =======
function renderProducts() {
  const tbody = $("#productsTableBody");
  const q = ($("#productSearch").value || "").toLowerCase();
  const rows = state.products
    .filter((p) => JSON.stringify(p).toLowerCase().includes(q))
    .map((p) => {
      const badge =
        p.stock < 10
          ? `<span class="badge badge--warn">${p.stock} cái</span>`
          : `<span class="badge badge--ok">${p.stock} cái</span>`;
      const status =
        p.status === "active"
          ? '<span class="badge badge--ok">Đang bán</span>'
          : '<span class="badge badge--warn">Ngừng bán</span>';
      return `<tr>
        <td><strong>${p.name}</strong><div style="color:#64748b;font-size:12px">${p.cpu} • ${
        p.ram
      }</div></td>
        <td>${p.brand}</td>
        <td><strong>${money(p.price)}</strong></td>
        <td>${badge}</td>
        <td>${p.category}</td>
        <td>${status}</td>
        <td>
          <button class="btn btn--ghost" data-edit="${p.id}">✏️ Sửa</button>
          <button class="btn btn--danger" data-del="${p.id}">🗑️ Xóa</button>
        </td>
      </tr>`;
    })
    .join("");

  tbody.innerHTML =
    rows ||
    `<tr><td colspan="7" style="text-align:center;color:#64748b;padding:28px">Chưa có sản phẩm</td></tr>`;

  $$("[data-edit]").forEach((b) =>
    b.addEventListener("click", () => openEditProduct(b.dataset.edit))
  );
  $$("[data-del]").forEach((b) =>
    b.addEventListener("click", () => deleteProduct(b.dataset.del))
  );
}

let currentEditingProduct = null;

function openEditProduct(id) {
  const p = state.products.find((x) => x.id === id);
  if (!p) return;
  currentEditingProduct = p;
  $("#productModalTitle").textContent = "Chỉnh sửa sản phẩm";

  $("#productName").value = p.name || "";
  $("#productBrand").value = p.brand || "";
  $("#productCategory").value = p.category || "";
  $("#productPrice").value = p.price || "";
  $("#productStock").value = p.stock || "";
  $("#productCpu").value = p.cpu || "";
  $("#productRam").value = p.ram || "";
  $("#productStorage").value = p.storage || "";
  $("#productGpu").value = p.gpu || "";
  $("#productScreen").value = p.screen || "";
  $("#productStatus").value = p.status || "active";

  const imgs = p.images || [];
  $("#productImage1").value = p.mainImage || imgs[0] || "";
  $("#productImage2").value = imgs[1] || "";
  $("#productImage3").value = imgs[2] || "";
  $("#productImage4").value = imgs[3] || "";
  $("#productImage5").value = imgs[4] || "";

  showModal("productModal");
}

function deleteProduct(id) {
  state.products = state.products.filter((x) => x.id !== id);
  saveState();
  renderAll();
  toast("Đã xóa sản phẩm");
}

function bindProductForm() {
  $("#productForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const img1 = $("#productImage1").value.trim();
    const images = [
      img1,
      $("#productImage2").value.trim(),
      $("#productImage3").value.trim(),
      $("#productImage4").value.trim(),
      $("#productImage5").value.trim(),
    ].filter(Boolean);

    const data = {
      id: currentEditingProduct ? currentEditingProduct.id : "P" + Date.now(),
      name: $("#productName").value.trim(),
      brand: $("#productBrand").value,
      category: $("#productCategory").value,
      price: parseFloat($("#productPrice").value),
      stock: parseInt($("#productStock").value || "0", 10),
      cpu: $("#productCpu").value,
      ram: $("#productRam").value,
      storage: $("#productStorage").value,
      gpu: $("#productGpu").value,
      screen: $("#productScreen").value,
      status: $("#productStatus").value,
      mainImage:
        img1 ||
        (currentEditingProduct && currentEditingProduct.mainImage) ||
        "",
      images: images.length
        ? images
        : currentEditingProduct && currentEditingProduct.images
        ? currentEditingProduct.images
        : [],
    };

    if (currentEditingProduct) {
      const idx = state.products.findIndex(
        (p) => p.id === currentEditingProduct.id
      );
      state.products[idx] = data;
    } else {
      state.products.push(data);
    }

    currentEditingProduct = null;
    saveState();
    hideModal("productModal");
    renderAll();
    toast("Đã lưu sản phẩm");
  });

  $("#productSearch").addEventListener("input", renderProducts);
}

// ======= Orders =======
function renderOrders() {
  const tbody = $("#ordersTableBody");
  const q = ($("#orderSearch").value || "").toLowerCase();
  const rows = state.orders
    .filter((o) => JSON.stringify(o).toLowerCase().includes(q))
    .map((o) => {
      const map = {
        pending: ["#fef3c7", "#92400e", "Chờ xác nhận"],
        processing: ["#dbeafe", "#1e40af", "Đang xử lý"],
        shipping: ["#e0e7ff", "#4338ca", "Đang giao"],
        completed: ["#dcfce7", "#16a34a", "Hoàn thành"],
        cancelled: ["#fee2e2", "#dc2626", "Đã hủy"],
      };
      const [bg, color, label] = map[o.status] || map.pending;
      return `<tr>
        <td><strong>#${o.id}</strong></td>
        <td>
          <div style="font-weight:600">${o.customerName}</div>
          <div style="font-size:12px;color:#64748b">${o.customerEmail}</div>
        </td>
        <td>${o.productName}</td>
        <td><strong>${money(o.totalAmount)}</strong></td>
        <td><span class="badge" style="background:${bg};color:${color}">${label}</span></td>
        <td>${new Date(o.createdAt).toLocaleDateString("vi-VN")}</td>
        <td>
          <button class="btn btn--ghost" data-edit-order="${o.id}">✏️ Sửa</button>
          <button class="btn btn--danger" data-del-order="${o.id}">🗑️ Xóa</button>
        </td>
      </tr>`;
    })
    .join("");

  tbody.innerHTML =
    rows ||
    `<tr><td colspan="7" style="text-align:center;color:#64748b;padding:28px">Chưa có đơn hàng</td></tr>`;

  $$("[data-edit-order]").forEach((b) =>
    b.addEventListener("click", () => openEditOrder(b.dataset.editOrder))
  );
  $$("[data-del-order]").forEach((b) =>
    b.addEventListener("click", () => deleteOrder(b.dataset.delOrder))
  );
}

let currentEditingOrder = null;

function openEditOrder(id) {
  const o = state.orders.find((x) => x.id === id);
  if (!o) return;
  currentEditingOrder = o;

  $("#orderModalTitle").textContent = "Chỉnh sửa đơn hàng";
  $("#orderCustomerName").value = o.customerName || "";
  $("#orderCustomerEmail").value = o.customerEmail || "";
  $("#orderCustomerPhone").value = o.customerPhone || "";
  $("#orderStatus").value = o.status || "pending";
  $("#orderProduct").value = o.productName || "";

  showModal("orderModal");
}

function deleteOrder(id) {
  state.orders = state.orders.filter((x) => x.id !== id);
  saveState();
  renderAll();
  toast("Đã xóa đơn hàng");
}

function bindOrderForm() {
  $("#orderForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const prodName = $("#orderProduct").value;
    const prod = state.products.find((p) => p.name === prodName);
    const amount = prod ? prod.price : 0;

    const data = {
      id: currentEditingOrder ? currentEditingOrder.id : "ORD" + Date.now(),
      customerName: $("#orderCustomerName").value.trim(),
      customerEmail: $("#orderCustomerEmail").value.trim(),
      customerPhone: $("#orderCustomerPhone").value.trim(),
      productName: prodName,
      totalAmount: amount,
      status: $("#orderStatus").value,
      createdAt: currentEditingOrder
        ? currentEditingOrder.createdAt
        : new Date().toISOString(),
    };

    if (currentEditingOrder) {
      const idx = state.orders.findIndex(
        (o) => o.id === currentEditingOrder.id
      );
      state.orders[idx] = data;
    } else {
      state.orders.push(data);
    }

    currentEditingOrder = null;
    saveState();
    hideModal("orderModal");
    renderAll();
    toast("Đã lưu đơn hàng");
  });

  $("#orderSearch").addEventListener("input", renderOrders);
}

function updateOrderProductSelect() {
  const select = $("#orderProduct");
  select.innerHTML =
    '<option value="">Chọn sản phẩm</option>' +
    state.products.map((p) => `<option>${p.name}</option>`).join("");
}

// ======= Customers =======
function getCustomers() {
  const map = {};
  state.orders.forEach((o) => {
    const k = o.customerEmail;
    if (!map[k]) {
      map[k] = {
        name: o.customerName,
        email: o.customerEmail,
        phone: o.customerPhone,
        orderCount: 0,
        totalSpent: 0,
      };
    }
    map[k].orderCount++;
    map[k].totalSpent += o.totalAmount || 0;
  });
  return Object.values(map);
}

function renderCustomers() {
  const tbody = $("#customersTableBody");
  const q = ($("#customerSearch").value || "").toLowerCase();
  const rows = getCustomers()
    .filter((c) => JSON.stringify(c).toLowerCase().includes(q))
    .map(
      (c) => `<tr>
        <td>${c.name}</td>
        <td>${c.email}</td>
        <td>${c.phone}</td>
        <td><strong>${c.orderCount}</strong></td>
        <td><strong>${money(c.totalSpent)}</strong></td>
      </tr>`
    )
    .join("");

  tbody.innerHTML =
    rows ||
    `<tr><td colspan="5" style="text-align:center;color:#64748b;padding:28px">Chưa có khách hàng</td></tr>`;

  $("#customerSearch").addEventListener("input", renderCustomers, {
    once: true,
  });
}

// ======= Inventory =======
function renderInventory() {
  const totalValue = state.products.reduce(
    (s, p) => s + (p.price || 0) * (p.stock || 0),
    0
  );
  const lowStock = state.products.filter((p) => (p.stock || 0) < 10);
  $("#inventoryValue").textContent = money(totalValue);
  $("#lowStockCount").textContent = lowStock.length;
  $("#totalProducts").textContent = state.products.length;

  const list = $("#lowStockList");
  list.innerHTML =
    lowStock
      .map(
        (p) =>
          `<div style="padding:12px;border:1px solid #fee2e2;background:#fef2f2;border-radius:10px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center">
            <div>
              <div style="font-weight:600">${p.name}</div>
              <div style="color:#64748b;font-size:12px">${p.brand}</div>
            </div>
            <span class="badge badge--warn">Còn ${p.stock} cái</span>
          </div>`
      )
      .join("") ||
    `<p style="color:#64748b;text-align:center;padding:16px">Tất cả sản phẩm đều đủ hàng 👍</p>`;
}

// ======= Reports =======
let monthlyRevenueChart, categoryChart;

function renderReports() {
  // demo doanh thu theo tháng
  const months = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
  ];
  const values = months.map(() =>
    Math.round(Math.random() * 400_000_000 + 250_000_000)
  );
  const ctx1 = $("#monthlyRevenueChart");
  if (ctx1) {
    monthlyRevenueChart && monthlyRevenueChart.destroy();
    monthlyRevenueChart = new Chart(ctx1, {
      type: "bar",
      data: {
        labels: months.map((m) => `Th ${m}`),
        datasets: [
          {
            label: "Doanh thu (VND)",
            data: values,
            backgroundColor: "#3b82f6",
          },
        ],
      },
      options: { responsive: true, scales: { y: { beginAtZero: true } } },
    });
  }

  const catMap = {};
  state.products.forEach(
    (p) => (catMap[p.category] = (catMap[p.category] || 0) + 1)
  );
  const ctx2 = $("#categoryChart");
  if (ctx2) {
    categoryChart && categoryChart.destroy();
    categoryChart = new Chart(ctx2, {
      type: "doughnut",
      data: {
        labels: Object.keys(catMap),
        datasets: [
          {
            data: Object.values(catMap),
            backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"],
          },
        ],
      },
      options: { responsive: true },
    });
  }

  const top = getCustomers()
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 5);
  $("#topCustomersList").innerHTML =
    top
      .map(
        (c, i) => `<div style="display:flex;justify-content:space-between;border-bottom:1px solid #e2e8f0;padding:10px 0">
      <div style="display:flex;gap:10px;align-items:center">
        <div class="avatar" style="width:28px;height:28px">${i + 1}</div>
        <div>
          <div style="font-weight:600">${c.name}</div>
          <div style="font-size:12px;color:#64748b">${c.orderCount} đơn</div>
        </div>
      </div>
      <div style="font-weight:700">${money(c.totalSpent)}</div>
    </div>`
      )
      .join("") ||
    `<p style="color:#64748b;text-align:center;padding:16px">Chưa có dữ liệu</p>`;
}

// ======= Modals =======
function showModal(id) {
  $("#" + id).classList.add("show");
}
function hideModal(id) {
  $("#" + id).classList.remove("show");
}

function initModals() {
  // open
  $$("[data-open]").forEach((b) =>
    b.addEventListener("click", () => showModal(b.dataset.open))
  );
  // close
  $$("[data-close]").forEach((b) =>
    b.addEventListener("click", (e) =>
      hideModal(e.target.closest(".modal").id)
    )
  );
  $$(".modal").forEach((m) =>
    m.addEventListener("click", (e) => {
      if (e.target.classList.contains("modal")) hideModal(e.target.id);
    })
  );
}

// ======= Master render =======
function renderAll() {
  renderDashboard();
  renderProducts();
  renderOrders();
  renderCustomers();
  renderInventory();
  renderReports();
  updateOrderProductSelect();
}

// ======= Auth check (bảo vệ trang admin) =======
function checkAdminAuth() {
  try {
    const isAdmin = localStorage.getItem("isAdmin");
    if (isAdmin !== "true") {
      window.location.href = "Dangnhap.html";
      return false;
    }
    return true;
  } catch (e) {
    window.location.href = "Dangnhap.html";
    return false;
  }
}

// ======= Init =======
function initAdminApp() {
  loadState();
  initSidebar();
  initModals();
  bindProductForm();
  bindOrderForm();
  renderAll();
}

window.addEventListener("DOMContentLoaded", () => {
  if (!checkAdminAuth()) return;
  initAdminApp();
});
