document.addEventListener("DOMContentLoaded", () => {
    // Dữ liệu mẫu
    const products = [
        { id: 1, name: "Laptop Dell XPS 13", price: "30,000,000" },
        { id: 2, name: "MacBook Pro 14", price: "50,000,000" },
    ];

    const orders = [
        { id: 1, customer: "Nguyễn Văn A", total: "30,000,000", status: "Đang xử lý" },
        { id: 2, customer: "Trần Thị B", total: "50,000,000", status: "Hoàn thành" },
    ];

    const users = [
        { id: 1, name: "Nguyễn Văn A", email: "nguyenvana@gmail.com" },
        { id: 2, name: "Trần Thị B", email: "tranthib@gmail.com" },
    ];

    // Hiển thị sản phẩm
    const productTable = document.getElementById("productTable");
    products.forEach(product => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.price}</td>
            <td><button onclick="editProduct(${product.id})">Sửa</button> <button onclick="deleteProduct(${product.id})">Xóa</button></td>
        `;
        productTable.appendChild(row);
    });

    // Hiển thị đơn hàng
    const orderTable = document.getElementById("orderTable");
    orders.forEach(order => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.customer}</td>
            <td>${order.total}</td>
            <td>${order.status}</td>
        `;
        orderTable.appendChild(row);
    });

    // Hiển thị người dùng
    const userTable = document.getElementById("userTable");
    users.forEach(user => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td><button onclick="deleteUser(${user.id})">Xóa</button></td>
        `;
        userTable.appendChild(row);
    });
});

// Thêm sản phẩm
function addProduct() {
    alert("Chức năng thêm sản phẩm!");
}

// Sửa sản phẩm
function editProduct(id) {
    alert(`Chỉnh sửa sản phẩm có ID: ${id}`);
}

// Xóa sản phẩm
function deleteProduct(id) {
    alert(`Xóa sản phẩm có ID: ${id}`);
}

// Xóa người dùng
function deleteUser(id) {
    alert(`Xóa người dùng có ID: ${id}`);
}