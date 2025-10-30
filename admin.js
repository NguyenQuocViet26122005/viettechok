document.addEventListener("DOMContentLoaded", () => {
    // Dữ liệu mẫu cho sản phẩm (bao gồm danh sách hình ảnh)
    const products = [
        {
            id: 1,
            name: "Laptop Dell XPS 13",
            price: "30,000,000",
            images: [
                "anh/dell1.jpg",
                "anh/dell2.jpg",
                "anh/dell3.jpg",
                "anh/dell4.jpg",
            ],
        },
        {
            id: 2,
            name: "MacBook Pro 14",
            price: "50,000,000",
            images: [
                "anh/macbook1.jpg",
                "anh/macbook2.jpg",
                "anh/macbook3.jpg",
                "anh/macbook4.jpg",
            ],
        },
        {
            id: 3,
            name: "Asus ROG Zephyrus G14",
            price: "40,000,000",
            images: [
                "anh/asus1.jpg",
                "anh/asus2.jpg",
                "anh/asus3.jpg",
                "anh/asus4.jpg",
            ],
        },
    ];

    // Hiển thị sản phẩm
    const productTable = document.getElementById("productTable");
    products.forEach(product => {
        const row = document.createElement("tr");

        // Hiển thị hình ảnh (chỉ hiển thị ảnh đầu tiên và nút xem thêm)
        const imageHtml = `
            <div class="product-images">
                <img src="${product.images[0]}" alt="Ảnh sản phẩm" class="thumbnail">
                <button onclick="viewImages(${product.id})">Xem thêm</button>
            </div>
        `;

        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.price}</td>
            <td>${imageHtml}</td>
            <td>
                <button onclick="editProduct(${product.id})">Sửa</button>
                <button onclick="deleteProduct(${product.id})">Xóa</button>
            </td>
        `;
        productTable.appendChild(row);
    });

    // Hàm xử lý xem thêm hình ảnh
    window.viewImages = (id) => {
        const product = products.find(p => p.id === id);
        if (product) {
            const imagesHtml = product.images
                .map(img => `<img src="${img}" alt="Ảnh sản phẩm" class="full-image">`)
                .join("");
            const modalContent = `
                <div class="modal">
                    <div class="modal-content">
                        <span class="close-btn" onclick="closeModal()">&times;</span>
                        ${imagesHtml}
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML("beforeend", modalContent);
        }
    };

    // Hàm đóng modal
    window.closeModal = () => {
        const modal = document.querySelector(".modal");
        if (modal) modal.remove();
    };
});

// Các hàm xử lý khác
function addProduct() {
    alert("Thêm sản phẩm mới!");
}

function editProduct(id) {
    alert(`Chỉnh sửa sản phẩm có ID: ${id}`);
}

function deleteProduct(id) {
    alert(`Xóa sản phẩm có ID: ${id}`);
}