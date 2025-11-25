async function loadOrders() {
    try {
        const orders = await apiFetch("/orders");
        renderOrders(orders);
    } catch (err) {
        showAlert("Error al cargar historial: " + err.message, "danger");
    }
}

function renderOrders(orders) {
    const container = document.getElementById("ordersContainer");
    const emptyMsg = document.getElementById("emptyMsg");

    container.innerHTML = "";
    emptyMsg.innerHTML = "";

    if (!orders || orders.length === 0) {
        emptyMsg.innerHTML = "No tienes pedidos todavía 🛒";
        return;
    }

    let html = `
        <div class="order-table">
            <table class="table mb-0">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Fecha</th>
                        <th>Total</th>
                        <th>Estado</th>
                        <th>Productos</th>
                    </tr>
                </thead>
                <tbody>
    `;

    orders.forEach(order => {
        const itemsHTML = order.items
            .map(item => `${item.name} (x${item.quantity})`)
            .join("<br>");

        html += `
            <tr>
                <td>${order.id}</td>
                <td>${new Date(order.created_at).toLocaleString()}</td>
                <td>${order.total} €</td>
                <td><span class="status">${order.status}</span></td>
                <td>${itemsHTML}</td>
            </tr>
        `;
    });

    html += `
                </tbody>
            </table>
        </div>
    `;

    container.innerHTML = html;
}
