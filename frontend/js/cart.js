// Mostrar carrito
function showCart() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const cartDiv = document.getElementById("cart");
    const emptyDiv = document.getElementById("emptyCart");
    const actionsDiv = document.getElementById("cartActions");
    const totalDiv = document.getElementById("total");

    cartDiv.innerHTML = "";

    if (cart.length === 0) {
        emptyDiv.innerHTML = "Tu carrito está vacío 😕";
        actionsDiv.classList.add("d-none");
        return;
    }

    emptyDiv.innerHTML = "";
    actionsDiv.classList.remove("d-none");

    let total = 0;

    cart.forEach((item, index) => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "cart-item d-flex justify-content-between align-items-center";

        const subtotal = item.price * item.quantity;
        total += subtotal;

        itemDiv.innerHTML = `
            <div>
                <h5 class="fw-bold">${item.name}</h5>
                <p class="mb-1 text-secondary">Precio: ${item.price} €</p>
                <p class="mb-1 text-secondary">Cantidad: ${item.quantity}</p>
                <p class="fw-semibold">Subtotal: ${subtotal} €</p>
            </div>

            <button class="remove-btn" onclick="removeItem(${index})">Eliminar</button>
        `;

        cartDiv.appendChild(itemDiv);
    });

    totalDiv.innerHTML = `Total: <b>${total} €</b>`;
}

// Eliminar un producto del carrito
function removeItem(index) {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    showCart();
    showAlert("Producto eliminado ✔", "success");
}

// Vaciar carrito
function clearCart() {
    localStorage.removeItem("cart");
    showCart();
    showAlert("Carrito vaciado", "danger");
}

// Finalizar compra
async function checkout() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    if (cart.length === 0) {
        showAlert("El carrito está vacío", "danger");
        return;
    }

    try {
        const res = await apiFetch("/orders", {
            method: "POST",
            body: JSON.stringify({ items: cart })
        });

        clearCart(); // Vaciar carrito tras éxito
        showAlert("Compra realizada ✔", "success");

        setTimeout(() => {
            window.location.href = "order-history.html";
        }, 1000);

    } catch (err) {
        showAlert("Error al procesar la compra: " + err.message, "danger");
    }
}
