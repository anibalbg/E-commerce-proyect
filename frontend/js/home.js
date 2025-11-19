// ================================================
//                 GolfStore - home.js
// ================================================

// Estado global
let productsCache = [];
let currentCategory = "all";
let currentSearch = "";

// ================================================
//               INICIO DE PÁGINA
// ================================================
async function initPage() {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user || !token) {
        window.location.href = "index.html";
        return;
    }

    // Mostrar info usuario
    document.getElementById("userInfo").innerHTML = `
        <b>${user.name}</b> (${user.email})
        <button class="btn btn-sm btn-outline-light ms-2" onclick="logout()">Salir</button>
    `;

    // Panel admin si es admin
    if (user.is_admin) {
        document.getElementById("adminPanel").classList.remove("d-none");
        loadCategoriesIntoSelect();
    }

    updateCartCount();
    await loadCategories();
    await loadProducts();
}

// ================================================
//               CATEGORÍAS
// ================================================
async function loadCategories() {
    try {
        const categories = await apiFetch("/categories");
        const container = document.getElementById("categoryFilters");

        container.innerHTML = `
            <span class="badge-category active" onclick="filterByCategory('all', event)">Todos</span>
        `;

        categories.forEach(cat => {
            container.innerHTML += `
                <span class="badge-category" onclick="filterByCategory(${cat.id}, event)">
                    ${cat.name}
                </span>`;
        });

    } catch (err) {
        showAlert("Error cargando categorías", "danger");
    }
}

async function loadCategoriesIntoSelect() {
    const categories = await apiFetch("/categories");
    const select = document.getElementById("category");

    categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat.id;
        option.textContent = cat.name;
        select.appendChild(option);
    });
}

function filterByCategory(categoryId, evt) {
    currentCategory = categoryId;
    currentSearch = "";
    document.getElementById("searchInput").value = "";

    document.querySelectorAll(".badge-category").forEach(btn => btn.classList.remove("active"));
    evt.target.classList.add("active");

    loadProducts();
}

// ================================================
//                 BUSCADOR
// ================================================
function searchProducts() {
    currentSearch = document.getElementById("searchInput").value.trim();
    loadProducts();
}

// ================================================
//             CARGAR PRODUCTOS
// ================================================
async function loadProducts() {
    try {
        let url = "/products";
        const params = [];

        if (currentCategory !== "all") params.push("category_id=" + currentCategory);
        if (currentSearch !== "") params.push("search=" + encodeURIComponent(currentSearch));

        if (params.length > 0) url += "?" + params.join("&");

        const products = await apiFetch(url);
        productsCache = products;

        renderProducts(products);

    } catch (err) {
        showAlert("Error al cargar productos", "danger");
    }
}

// ================================================
//           RENDER TARJETAS PRODUCTOS
// ================================================
function renderProducts(products) {
    const container = document.getElementById("products");
    container.innerHTML = "";

    if (!products || products.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center text-muted mt-4">
                <h5>No hay productos que coincidan</h5>
            </div>`;
        return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    const isAdmin = user?.is_admin;

    products.forEach(p => {
        const col = document.createElement("div");
        col.className = "col-lg-3 col-md-4 col-sm-6";

        col.innerHTML = `
            <div class="product-card position-relative">

                ${p.stock === 0 ? `<div class="out-of-stock">AGOTADO</div>` : ""}

                <h5>${p.name}</h5>
                <p class="text-muted">${p.description || "Sin descripción"}</p>
                <p class="fw-bold">${p.price} €</p>
                <p class="small text-secondary">Stock: ${p.stock}</p>

                <button class="btn btn-add w-100 mb-2"
                        ${p.stock === 0 ? "disabled" : ""}
                        onclick="addToCart(${p.id}, '${p.name.replace(/'/g, "\\'")}', ${p.price})">
                    🛒 Añadir
                </button>

                ${isAdmin ? `
                <button class="btn btn-edit w-100 mb-2"
                        onclick="openEditProduct(${p.id})">
                    ✏️ Editar
                </button>

                <div class="input-group mb-3">
                    <input id="restock-${p.id}" 
                           type="number"
                           min="1"
                           value="1"
                           class="form-control form-control-sm">

                    <button class="btn btn-warning" onclick="restock(${p.id})">
                        Reponer
                    </button>
                </div>

                <button class="btn btn-danger w-100" onclick="deleteProduct(${p.id})">
                    🗑 Eliminar
                </button>
                ` : ""}
            </div>
        `;

        container.appendChild(col);
    });
}

// ================================================
//                  REPOSICIÓN
// ================================================
async function restock(id) {
    const input = document.getElementById(`restock-${id}`);
    const qty = parseInt(input?.value || "0");

    if (!qty || qty <= 0) {
        showAlert("Cantidad inválida", "danger");
        return;
    }

    try {
        await apiFetch(`/products/${id}/restock`, {
            method: "PUT",
            body: JSON.stringify({ amount: qty }),
        });

        showAlert("Stock actualizado ✔", "success");
        loadProducts();

    } catch (err) {
        showAlert("Error al reponer: " + err.message, "danger");
    }
}

// ================================================
//                 CARRITO
// ================================================
function addToCart(id, name, price) {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find(i => i.id === id);

    if (existing) existing.quantity++;
    else cart.push({ id, name, price, quantity: 1 });

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();

    showAlert(`${name} añadido al carrito ✔`, "success");
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    document.getElementById("cartCount").innerText = cart.length;
}

function goToCart() {
    window.location.href = "cart.html";
}

// ================================================
//                CRUD ADMIN
// ================================================
async function createProduct() {
    const body = {
        name: document.getElementById("name").value,
        price: document.getElementById("price").value,
        stock: document.getElementById("stock").value,
        description: document.getElementById("description").value,
        category_id: document.getElementById("category").value || null
    };

    try {
        await apiFetch("/products", {
            method: "POST",
            body: JSON.stringify(body),
        });

        showAlert("Producto creado ✔", "success");
        loadProducts();

    } catch (err) {
        showAlert("Error al crear producto: " + err.message, "danger");
    }
}

function openEditProduct(id) {
    const p = productsCache.find(x => x.id === id);
    if (!p) return;

    document.getElementById("editProductId").value = p.id;
    document.getElementById("editProductName").value = p.name;
    document.getElementById("editProductDescription").value = p.description || "";
    document.getElementById("editProductPrice").value = p.price;
    document.getElementById("editProductStock").value = p.stock;

    document.getElementById("editProductForm").classList.remove("d-none");
    window.scrollTo({ top: 0, behavior: "smooth" });
}

async function saveProduct() {
    const id = document.getElementById("editProductId").value;

    const body = {
        name: document.getElementById("editProductName").value,
        description: document.getElementById("editProductDescription").value,
        price: parseFloat(document.getElementById("editProductPrice").value),
        stock: parseInt(document.getElementById("editProductStock").value, 10)
    };

    try {
        await apiFetch(`/products/${id}`, {
            method: "PUT",
            body: JSON.stringify(body),
        });

        showAlert("Producto actualizado ✔", "success");
        document.getElementById("editProductForm").classList.add("d-none");
        loadProducts();

    } catch (err) {
        showAlert("Error al actualizar producto: " + err.message, "danger");
    }
}

function cancelEdit() {
    document.getElementById("editProductForm").classList.add("d-none");
}

async function deleteProduct(id) {
    if (!confirm("¿Eliminar producto?")) return;

    try {
        await apiFetch(`/products/${id}`, { method: "DELETE" });
        showAlert("Producto eliminado", "danger");
        loadProducts();

    } catch (err) {
        showAlert("Error al eliminar producto: " + err.message, "danger");
    }
}

// ================================================
//                     LOGOUT
// ================================================
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "index.html";
}
