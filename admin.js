// ======= Utilities =======
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

const toast = (msg, duration = 3000) => {
  const t = $("#toast");
  if (!t) return;
  $("#toastMessage").textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), duration);
};

const money = (n) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(n || 0);

// ======= State (in-memory + localStorage) =======
const LS_KEY = "laptop_admin_data_v1";
// Các trang khác (index, trang sản phẩm) có thể đọc dữ liệu này từ localStorage.

// BroadcastChannel để thông báo các trang khác khi có thay đổi
const broadcastChannel = new BroadcastChannel('product-updates');

let state = {
  products: [],
  orders: [],
  promotions: [],
  categories: [],
  customers: [],
};

function loadState() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const loaded = JSON.parse(raw);
      state = {
        products: loaded.products || [],
        orders: loaded.orders || [],
        promotions: loaded.promotions || [],
        categories: loaded.categories || [],
        customers: loaded.customers || [],
      };
      // Nếu không có categories hoặc promotions, seed sample
      if (!state.categories || state.categories.length === 0) {
        state.categories = [
          { id: "CAT001", name: "Gaming", description: "Laptop chơi game", status: "active" },
          { id: "CAT002", name: "Văn phòng", description: "Laptop văn phòng", status: "active" },
          { id: "CAT003", name: "Đồ họa", description: "Laptop đồ họa, kỹ thuật", status: "active" },
          { id: "CAT004", name: "Học tập", description: "Laptop học tập, sinh viên", status: "active" },
        ];
        saveState();
      }
      if (!state.promotions || state.promotions.length === 0) {
        state.promotions = [];
      }
      if (!state.customers || state.customers.length === 0) {
        state.customers = [
          {
            id: "CUST001",
            name: "Nguyễn Văn An",
            email: "an.nguyen@email.com",
            phone: "0123456789",
            username: "nguyenvana",
            password: "123456",
          },
          {
            id: "CUST002",
            name: "Trần Thị Bình",
            email: "binh.tran@email.com",
            phone: "0987654321",
            username: "tranthibinh",
            password: "123456",
          },
        ];
        saveState();
      }
    } else {
      seedSample();
    }
  } catch {
    seedSample();
  }
}

function saveState() {
  localStorage.setItem(LS_KEY, JSON.stringify(state));
  const updateTimestamp = Date.now();
  localStorage.setItem('laptop_admin_products_update_time', updateTimestamp.toString());
  broadcastChannel.postMessage({ type: 'products-updated', timestamp: updateTimestamp });
}

function seedSample() {
  state.categories = [
    { id: "CAT001", name: "Gaming", description: "Laptop chơi game", status: "active" },
    { id: "CAT002", name: "Văn phòng", description: "Laptop văn phòng", status: "active" },
    { id: "CAT003", name: "Đồ họa", description: "Laptop đồ họa, kỹ thuật", status: "active" },
    { id: "CAT004", name: "Học tập", description: "Laptop học tập, sinh viên", status: "active" },
  ];

  state.promotions = [
    {
      id: "PROM001",
      code: "KM001",
      name: "Giảm giá 20%",
      type: "percent",
      value: 20,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      description: "Giảm giá 20% cho tất cả sản phẩm",
      status: "active",
    },
  ];

  state.customers = [
    {
      id: "CUST001",
      name: "Nguyễn Văn An",
      email: "an.nguyen@email.com",
      phone: "0123456789",
      username: "nguyenvana",
      password: "123456",
    },
    {
      id: "CUST002",
      name: "Trần Thị Bình",
      email: "binh.tran@email.com",
      phone: "0987654321",
      username: "tranthibinh",
      password: "123456",
    },
  ];

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
      description: "Laptop cao cấp với màn hình OLED sắc nét, hiệu năng mạnh mẽ phù hợp cho công việc văn phòng và giải trí.",
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
      description: "MacBook Pro với chip M2 Pro mạnh mẽ, màn hình XDR tuyệt đẹp, hoàn hảo cho công việc đồ họa và video editing chuyên nghiệp.",
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
      description: "Laptop gaming mạnh mẽ với card đồ họa RTX 3070, màn hình 144Hz mượt mà, thiết kế RGB đẹp mắt, hoàn hảo cho game thủ.",
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
  // Ẩn tất cả sections
  $$(".section").forEach((s) => {
    s.classList.add("is-hidden");
    s.style.display = ""; // Reset display style
  });
  
  // Hiển thị section được chọn
  const targetSection = $("#" + id);
  if (targetSection) {
    targetSection.classList.remove("is-hidden");
  }
  
  // Cập nhật menu active
  $$(".menu__item").forEach((b) => b.classList.remove("active"));
  const btn = $(`.menu__item[data-target="${id}"]`);
  if (btn) btn.classList.add("active");

  if (window.innerWidth <= 960) $("#sidebar").classList.remove("open");
}

function initSidebar() {
  // Load trạng thái sidebar từ localStorage
  const sidebarCollapsed = localStorage.getItem("sidebarCollapsed") === "true";
  if (sidebarCollapsed) {
    $("#sidebar").classList.add("collapsed");
  }

  // Toggle sidebar (thu gọn/mở rộng)
  $("#btnToggleSidebar").addEventListener("click", () => {
    if (window.innerWidth <= 960) {
      // Trên mobile: toggle open/close
    $("#sidebar").classList.toggle("open");
    } else {
      // Trên desktop: toggle collapsed/expanded
      const sidebar = $("#sidebar");
      sidebar.classList.toggle("collapsed");
      // Lưu trạng thái vào localStorage
      localStorage.setItem("sidebarCollapsed", sidebar.classList.contains("collapsed") ? "true" : "false");
    }
  });

  $$(".menu__item").forEach((btn) =>
    btn.addEventListener("click", () => {
      activateSection(btn.dataset.target);
      // Trên mobile, đóng sidebar sau khi chọn menu
      if (window.innerWidth <= 960) {
        $("#sidebar").classList.remove("open");
      }
    })
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
  if (!tbody) {
    // Chỉ log lỗi nếu section products đang được hiển thị
    const productsSection = $("#products");
    if (productsSection && !productsSection.classList.contains("is-hidden")) {
      console.error("❌ Không tìm thấy bảng sản phẩm (productsTableBody)");
    }
    return;
  }
  
  const searchInput = $("#productSearch");
  const q = searchInput ? (searchInput.value || "").toLowerCase() : "";
  
  const filteredProducts = state.products.filter((p) => 
    JSON.stringify(p).toLowerCase().includes(q)
  );
  
  const rows = filteredProducts
    .map((p) => {
      const badge = p.stock < 10
          ? `<span class="badge badge--warn">${p.stock} cái</span>`
          : `<span class="badge badge--ok">${p.stock} cái</span>`;
      const status = p.status === "active"
          ? '<span class="badge badge--ok">Đang bán</span>'
          : '<span class="badge badge--warn">Ngừng bán</span>';
      const productCode = p.code || p.id;
      return `<tr>
        <td><strong style="color:#000">#${productCode}</strong></td>
        <td><strong>${p.name}</strong><div style="color:#64748b;font-size:12px">${p.cpu || ''} • ${p.ram || ''}</div></td>
        <td>${p.brand || ''}</td>
        <td><strong>${money(p.price)}</strong></td>
        <td>${badge}</td>
        <td>${p.category || ''}</td>
        <td>${status}</td>
        <td>
          <button class="btn btn--ghost" data-edit="${p.id}">✏️ Sửa</button>
          <button class="btn btn--danger" data-del="${p.id}">🗑️ Xóa</button>
        </td>
      </tr>`;
    })
    .join("");

  tbody.innerHTML = rows || 
    `<tr><td colspan="8" style="text-align:center;color:#64748b;padding:28px">Chưa có sản phẩm</td></tr>`;

  // Bind event listeners
  tbody.querySelectorAll("[data-edit]").forEach((b) => {
    b.onclick = () => openEditProduct(b.dataset.edit);
  });
  
  tbody.querySelectorAll("[data-del]").forEach((b) => {
    b.onclick = () => deleteProduct(b.dataset.del);
  });
}

let currentEditingProduct = null;

function openEditProduct(id) {
  const p = state.products.find((x) => x.id === id);
  if (!p) return;
  currentEditingProduct = p;
  $("#productModalTitle").textContent = "Chỉnh sửa sản phẩm";

  updateProductCategorySelect();

  $("#productCode").value = p.code || p.id || "";
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
  $("#productDescription").value = p.description || "";
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
  if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
    return;
  }
  
  // Xóa sản phẩm
  state.products = state.products.filter((x) => x.id !== id);
  saveState();
  
  // Chỉ hiển thị section products nếu đang ở section đó
  activateSection('products');
  renderProducts();
  toast("✅ Đã xóa sản phẩm thành công!", 3000);
  
  broadcastChannel.postMessage({ type: 'product-deleted', productId: id });
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

    const productId = currentEditingProduct ? currentEditingProduct.id : "P" + Date.now();
    const productCode = $("#productCode").value.trim() || productId;

    const data = {
      id: productId,
      code: productCode,
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
      description: $("#productDescription").value.trim(),
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

    const isEditing = !!currentEditingProduct;
    
    // Cập nhật hoặc thêm sản phẩm vào state
    if (currentEditingProduct) {
      const idx = state.products.findIndex((p) => p.id === currentEditingProduct.id);
      if (idx !== -1) {
      state.products[idx] = data;
      }
    } else {
      state.products.push(data);
    }

    saveState();
    hideModal("productModal");
    currentEditingProduct = null;
    
    // Chỉ hiển thị section products
    activateSection('products');
    renderProducts();
    
    const message = isEditing 
      ? "✅ Đã cập nhật sản phẩm thành công!" 
      : "✅ Đã thêm sản phẩm mới thành công!";
    
    toast(message, 3000);
    
    broadcastChannel.postMessage({ 
      type: isEditing ? 'product-updated' : 'product-added', 
      productId: productId 
    });
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
  if (!confirm("Bạn có chắc chắn muốn xóa đơn hàng này không?")) {
    return;
  }
  
  state.orders = state.orders.filter((x) => x.id !== id);
  saveState();
  activateSection('orders');
  renderOrders();
  toast("✅ Đã xóa đơn hàng thành công!", 3000);
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

    const isEditing = !!currentEditingOrder;
    currentEditingOrder = null;
    saveState();
    hideModal("orderModal");
    activateSection('orders');
    renderOrders();
    
    const message = isEditing 
      ? "✅ Đã cập nhật đơn hàng thành công!" 
      : "✅ Đã thêm đơn hàng mới thành công!";
    
    toast(message, 3000);
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
  // Lấy từ state.customers và tính toán orderCount, totalSpent từ orders
  return state.customers.map((c) => {
    const orders = state.orders.filter((o) => o.customerEmail === c.email);
    return {
      ...c,
      orderCount: orders.length,
      totalSpent: orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
    };
  });
}

function renderCustomers() {
  const tbody = $("#customersTableBody");
  const q = ($("#customerSearch").value || "").toLowerCase();
  const rows = getCustomers()
    .filter((c) => JSON.stringify(c).toLowerCase().includes(q))
    .map(
      (c) => {
        const customerCode = c.code || c.id;
        return `<tr>
        <td><strong style="color:#000">#${customerCode}</strong></td>
        <td>${c.name}</td>
        <td>${c.email}</td>
        <td>${c.phone || "-"}</td>
        <td>${c.username || "-"}</td>
        <td>
          <span id="pwd-${c.id}" data-password="${(c.password || "").replace(/"/g, "&quot;")}" style="font-family: monospace;">${"*".repeat(c.password?.length || 0)}</span>
          <button class="btn btn--ghost" onclick="togglePassword('${c.id}')" style="padding:2px 6px;font-size:11px;margin-left:4px" title="Hiện/Ẩn mật khẩu" id="toggleBtn-${c.id}">🔒</button>
        </td>
        <td><strong>${c.orderCount}</strong></td>
        <td><strong>${money(c.totalSpent)}</strong></td>
        <td>
          <button class="btn btn--ghost" onclick="openEditCustomer('${c.id}')" style="padding:4px 8px;font-size:12px">✏️ Sửa</button>
          <button class="btn btn--danger" onclick="deleteCustomer('${c.id}')" style="padding:4px 8px;font-size:12px;margin-left:4px">🗑️ Xóa</button>
        </td>
      </tr>`;
      }
    )
    .join("");

  tbody.innerHTML =
    rows ||
    `<tr><td colspan="9" style="text-align:center;color:#64748b;padding:28px">Chưa có khách hàng</td></tr>`;

  $("#customerSearch").addEventListener("input", renderCustomers, {
    once: true,
  });
}

function togglePassword(customerId) {
  const pwdSpan = $(`#pwd-${customerId}`);
  const toggleBtn = $(`#toggleBtn-${customerId}`);
  if (!pwdSpan) return;
  
  const password = pwdSpan.getAttribute("data-password") || "";
  if (!password) return;
  
  // Kiểm tra xem đang hiển thị mật khẩu hay dấu sao
  const currentText = pwdSpan.textContent;
  const isHidden = currentText.includes("*");
  
  if (isHidden) {
    // Hiển thị mật khẩu thực
    pwdSpan.textContent = password;
    if (toggleBtn) toggleBtn.textContent = "🔓";
  } else {
    // Ẩn mật khẩu bằng dấu sao
    pwdSpan.textContent = "*".repeat(password.length);
    if (toggleBtn) toggleBtn.textContent = "🔒";
  }
}

let currentEditingCustomer = null;

function openEditCustomer(id) {
  const c = state.customers.find((x) => x.id === id);
  if (!c) return;
  currentEditingCustomer = c;
  $("#customerModalTitle").textContent = "Chỉnh sửa khách hàng";
  $("#customerCode").value = c.code || c.id || "";
  $("#customerName").value = c.name || "";
  $("#customerEmail").value = c.email || "";
  $("#customerPhone").value = c.phone || "";
  $("#customerUsername").value = c.username || "";
  $("#customerPassword").value = "";
  $("#customerPasswordConfirm").value = "";
  showModal("customerModal");
}

function deleteCustomer(id) {
  const c = state.customers.find((x) => x.id === id);
  if (!c) return;
  if (confirm(`Bạn có chắc chắn muốn xóa khách hàng "${c.name}"?`)) {
    state.customers = state.customers.filter((x) => x.id !== id);
    saveState();
    activateSection('customers');
    renderCustomers();
    toast("✅ Đã xóa khách hàng thành công!", 3000);
  }
}

function bindCustomerForm() {
  $("#customerForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#customerName").value.trim();
    const email = $("#customerEmail").value.trim();
    const phone = $("#customerPhone").value.trim();
    const username = $("#customerUsername").value.trim();
    const password = $("#customerPassword").value;
    const passwordConfirm = $("#customerPasswordConfirm").value;

    if (password !== passwordConfirm) {
      toast("Mật khẩu xác nhận không khớp!");
      return;
    }

    const customerCode = $("#customerCode").value.trim();
    
    if (currentEditingCustomer) {
      // Sửa
      const existing = state.customers.find((c) => c.email === email && c.id !== currentEditingCustomer.id);
      if (existing) {
        toast("Email đã tồn tại!");
        return;
      }
      const existingUsername = state.customers.find((c) => c.username === username && c.id !== currentEditingCustomer.id);
      if (existingUsername) {
        toast("Tài khoản đã tồn tại!");
        return;
      }
      currentEditingCustomer.code = customerCode || currentEditingCustomer.id;
      currentEditingCustomer.name = name;
      currentEditingCustomer.email = email;
      currentEditingCustomer.phone = phone;
      currentEditingCustomer.username = username;
      if (password) {
        currentEditingCustomer.password = password;
      }
    } else {
      // Thêm mới
      const existing = state.customers.find((c) => c.email === email);
      if (existing) {
        toast("Email đã tồn tại!");
        return;
      }
      const existingUsername = state.customers.find((c) => c.username === username);
      if (existingUsername) {
        toast("Tài khoản đã tồn tại!");
        return;
      }
      const newId = "CUST" + String(state.customers.length + 1).padStart(3, "0");
      state.customers.push({
        id: newId,
        code: customerCode || newId,
        name,
        email,
        phone,
        username,
        password,
      });
    }

    const isEdit = !!currentEditingCustomer;
    currentEditingCustomer = null;
    saveState();
    hideModal("customerModal");
    activateSection('customers');
    renderCustomers();
    
    const message = isEdit 
      ? "✅ Đã cập nhật khách hàng thành công!" 
      : "✅ Đã thêm khách hàng mới thành công!";
    
    toast(message, 3000);
  });
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

  // Đếm số đơn hàng theo danh mục (ưa chuộng nhất)
  const catMap = {};
  state.orders.forEach((order) => {
    // Tìm sản phẩm trong đơn hàng để lấy category
    const productNames = order.productName ? order.productName.split(", ") : [];
    productNames.forEach((productName) => {
      const product = state.products.find((p) => p.name === productName.trim());
      if (product && product.category) {
        catMap[product.category] = (catMap[product.category] || 0) + 1;
      }
    });
  });
  
  const ctx2 = $("#categoryChart");
  if (ctx2) {
    categoryChart && categoryChart.destroy();
    
    const categories = Object.keys(catMap);
    const counts = Object.values(catMap);
    
    categoryChart = new Chart(ctx2, {
      type: "doughnut",
      data: {
        labels: categories.length > 0 ? categories : ["Chưa có dữ liệu"],
        datasets: [
          {
            label: "Số đơn hàng",
            data: counts.length > 0 ? counts : [0],
            backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"],
          },
        ],
      },
      options: { 
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      },
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
    b.addEventListener("click", () => {
      const modalId = b.dataset.open;
      if (modalId === "productModal") {
        currentEditingProduct = null;
        $("#productModalTitle").textContent = "Thêm sản phẩm mới";
        updateProductCategorySelect();
        $("#productForm").reset();
      } else if (modalId === "promotionModal") {
        currentEditingPromotion = null;
        $("#promotionModalTitle").textContent = "Thêm khuyến mãi mới";
        $("#promotionForm").reset();
      } else if (modalId === "categoryModal") {
        currentEditingCategory = null;
        $("#categoryModalTitle").textContent = "Thêm danh mục mới";
        $("#categoryForm").reset();
      } else if (modalId === "customerModal") {
        currentEditingCustomer = null;
        $("#customerModalTitle").textContent = "Thêm khách hàng mới";
        $("#customerForm").reset();
      }
      showModal(modalId);
    })
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

// ======= Promotions =======
function renderPromotions() {
  const tbody = $("#promotionsTableBody");
  const q = ($("#promotionSearch").value || "").toLowerCase();
  const rows = state.promotions
    .filter((p) => JSON.stringify(p).toLowerCase().includes(q))
    .map((p) => {
      const now = new Date();
      const startDate = new Date(p.startDate);
      const endDate = new Date(p.endDate);
      let statusBadge = "";
      if (now < startDate) {
        statusBadge = '<span class="badge badge--warn">Chưa bắt đầu</span>';
      } else if (now > endDate) {
        statusBadge = '<span class="badge" style="background:#fee2e2;color:#dc2626">Đã hết hạn</span>';
      } else {
        statusBadge = '<span class="badge badge--ok">Đang áp dụng</span>';
      }

      const valueDisplay = p.type === "percent" 
        ? `${p.value}%` 
        : money(p.value);

      return `<tr>
        <td><strong>${p.code}</strong></td>
        <td>${p.name}</td>
        <td>${p.type === "percent" ? "Giảm %" : "Giảm tiền"}</td>
        <td><strong>${valueDisplay}</strong></td>
        <td>${new Date(p.startDate).toLocaleDateString("vi-VN")}</td>
        <td>${new Date(p.endDate).toLocaleDateString("vi-VN")}</td>
        <td>${statusBadge}</td>
        <td>
          <button class="btn btn--ghost" data-edit-promo="${p.id}">✏️ Sửa</button>
          <button class="btn btn--danger" data-del-promo="${p.id}">🗑️ Xóa</button>
        </td>
      </tr>`;
    })
    .join("");

  tbody.innerHTML =
    rows ||
    `<tr><td colspan="8" style="text-align:center;color:#64748b;padding:28px">Chưa có khuyến mãi</td></tr>`;

  $$("[data-edit-promo]").forEach((b) =>
    b.addEventListener("click", () => openEditPromotion(b.dataset.editPromo))
  );
  $$("[data-del-promo]").forEach((b) =>
    b.addEventListener("click", () => deletePromotion(b.dataset.delPromo))
  );
}

let currentEditingPromotion = null;

function openEditPromotion(id) {
  const p = state.promotions.find((x) => x.id === id);
  if (!p) return;
  currentEditingPromotion = p;
  $("#promotionModalTitle").textContent = "Chỉnh sửa khuyến mãi";

  $("#promotionCode").value = p.code || "";
  $("#promotionName").value = p.name || "";
  $("#promotionType").value = p.type || "";
  $("#promotionValue").value = p.value || "";
  $("#promotionStartDate").value = p.startDate || "";
  $("#promotionEndDate").value = p.endDate || "";
  $("#promotionDescription").value = p.description || "";

  showModal("promotionModal");
}

function deletePromotion(id) {
  if (!confirm("Bạn có chắc chắn muốn xóa khuyến mãi này không?")) {
    return;
  }
  
  state.promotions = state.promotions.filter((x) => x.id !== id);
  saveState();
  activateSection('promotions');
  renderPromotions();
  toast("✅ Đã xóa khuyến mãi thành công!", 3000);
}

function bindPromotionForm() {
  $("#promotionForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const data = {
      id: currentEditingPromotion ? currentEditingPromotion.id : "PROM" + Date.now(),
      code: $("#promotionCode").value.trim(),
      name: $("#promotionName").value.trim(),
      type: $("#promotionType").value,
      value: parseFloat($("#promotionValue").value) || 0,
      startDate: $("#promotionStartDate").value,
      endDate: $("#promotionEndDate").value,
      description: $("#promotionDescription").value.trim(),
      status: "active",
    };

    if (currentEditingPromotion) {
      const idx = state.promotions.findIndex(
        (p) => p.id === currentEditingPromotion.id
      );
      state.promotions[idx] = data;
    } else {
      state.promotions.push(data);
    }

    const isEditing = !!currentEditingPromotion;
    currentEditingPromotion = null;
    saveState();
    hideModal("promotionModal");
    activateSection('promotions');
    renderPromotions();
    
    const message = isEditing 
      ? "✅ Đã cập nhật khuyến mãi thành công!" 
      : "✅ Đã thêm khuyến mãi mới thành công!";
    
    toast(message, 3000);
  });

  $("#promotionSearch").addEventListener("input", renderPromotions);
}

// ======= Categories =======
function renderCategories() {
  const tbody = $("#categoriesTableBody");
  const q = ($("#categorySearch").value || "").toLowerCase();
  const rows = state.categories
    .filter((c) => JSON.stringify(c).toLowerCase().includes(q))
    .map((c) => {
      const productCount = state.products.filter(
        (p) => p.category === c.name
      ).length;
      const status =
        c.status === "active"
          ? '<span class="badge badge--ok">Hoạt động</span>'
          : '<span class="badge badge--warn">Tạm ngưng</span>';

      const categoryCode = c.code || c.id;
      return `<tr>
        <td><strong style="color:#000">#${categoryCode}</strong></td>
        <td><strong>${c.name}</strong></td>
        <td>${c.description || "-"}</td>
        <td><strong>${productCount}</strong> sản phẩm</td>
        <td>${status}</td>
        <td>
          <button class="btn btn--ghost" data-edit-cat="${c.id}">✏️ Sửa</button>
          <button class="btn btn--danger" data-del-cat="${c.id}">🗑️ Xóa</button>
        </td>
      </tr>`;
    })
    .join("");

  tbody.innerHTML =
    rows ||
    `<tr><td colspan="5" style="text-align:center;color:#64748b;padding:28px">Chưa có danh mục</td></tr>`;

  $$("[data-edit-cat]").forEach((b) =>
    b.addEventListener("click", () => openEditCategory(b.dataset.editCat))
  );
  $$("[data-del-cat]").forEach((b) =>
    b.addEventListener("click", () => deleteCategory(b.dataset.delCat))
  );
}

let currentEditingCategory = null;

function openEditCategory(id) {
  const c = state.categories.find((x) => x.id === id);
  if (!c) return;
  currentEditingCategory = c;
  $("#categoryModalTitle").textContent = "Chỉnh sửa danh mục";

  $("#categoryCode").value = c.code || c.id || "";
  $("#categoryName").value = c.name || "";
  $("#categoryDescription").value = c.description || "";
  $("#categoryStatus").value = c.status || "active";

  showModal("categoryModal");
}

function deleteCategory(id) {
  const cat = state.categories.find((c) => c.id === id);
  if (cat) {
    const productCount = state.products.filter((p) => p.category === cat.name).length;
    if (productCount > 0) {
      toast("Không thể xóa danh mục đang có sản phẩm!");
      return;
    }
  }
  if (!confirm("Bạn có chắc chắn muốn xóa danh mục này không?")) {
    return;
  }
  
  state.categories = state.categories.filter((x) => x.id !== id);
  saveState();
  activateSection('categories');
  renderCategories();
  toast("✅ Đã xóa danh mục thành công!", 3000);
}

function bindCategoryForm() {
  $("#categoryForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const categoryId = currentEditingCategory ? currentEditingCategory.id : "CAT" + Date.now();
    const categoryCode = $("#categoryCode").value.trim() || categoryId;
    
    const data = {
      id: categoryId,
      code: categoryCode,
      name: $("#categoryName").value.trim(),
      description: $("#categoryDescription").value.trim(),
      status: $("#categoryStatus").value,
    };

    if (currentEditingCategory) {
      const idx = state.categories.findIndex(
        (c) => c.id === currentEditingCategory.id
      );
      state.categories[idx] = data;
    } else {
      state.categories.push(data);
    }

    const isEditing = !!currentEditingCategory;
    currentEditingCategory = null;
    saveState();
    hideModal("categoryModal");
    activateSection('categories');
    renderCategories();
    
    const message = isEditing 
      ? "✅ Đã cập nhật danh mục thành công!" 
      : "✅ Đã thêm danh mục mới thành công!";
    
    toast(message, 3000);
  });

  $("#categorySearch").addEventListener("input", renderCategories);
}

function updateProductCategorySelect() {
  const select = $("#productCategory");
  if (!select) return;
  select.innerHTML =
    '<option value="">Chọn danh mục</option>' +
    state.categories
      .filter((c) => c.status === "active")
      .map((c) => `<option value="${c.name}">${c.name}</option>`)
      .join("");
}

// ======= Master render =======
function renderAll() {
  console.log("🔄 renderAll() được gọi");
  renderDashboard();
  renderProducts();
  renderOrders();
  renderCustomers();
  renderReports();
  renderPromotions();
  renderCategories();
  updateOrderProductSelect();
  updateProductCategorySelect();
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

// ======= Logout =======
function logout() {
  if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("currentUser");
    window.location.href = "Dangnhap.html";
  }
}

function initLogout() {
  const logoutBtn = $("#logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }
}

// ======= Đồng bộ dữ liệu từ các trang khác =======
function syncDataFromOtherPages() {
  try {
    // Kiểm tra xem có dữ liệu từ các trang khác không
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const loaded = JSON.parse(raw);
      // Merge products từ localStorage vào state hiện tại
      if (loaded.products && Array.isArray(loaded.products)) {
        // Merge: giữ lại sản phẩm mới, cập nhật sản phẩm đã có
        loaded.products.forEach((newProduct) => {
          const existingIndex = state.products.findIndex((p) => p.id === newProduct.id);
          if (existingIndex >= 0) {
            state.products[existingIndex] = newProduct; // Cập nhật
          } else {
            state.products.push(newProduct); // Thêm mới
          }
        });
        saveState();
        console.log("✅ Đã đồng bộ dữ liệu từ các trang khác");
      }
    }
  } catch (e) {
    console.error("Lỗi khi đồng bộ dữ liệu:", e);
  }
}

// ======= Init =======
function initAdminApp() {
  loadState();
  syncDataFromOtherPages(); // Đồng bộ dữ liệu từ các trang khác
  initSidebar();
  initModals();
  initLogout();
  bindProductForm();
  bindOrderForm();
  bindPromotionForm();
  bindCategoryForm();
  bindCustomerForm();
  
  // Đảm bảo render sau khi DOM sẵn sàng
  setTimeout(() => {
  renderAll();
  }, 100);
}

window.addEventListener("DOMContentLoaded", () => {
  if (!checkAdminAuth()) return;
  initAdminApp();
});
