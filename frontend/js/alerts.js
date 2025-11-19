// ================================================
//            GolfStore - alerts.js PRO
// ================================================

function showAlert(message, type = "info") {
    // Contenedor dinámico de alertas
    let container = document.getElementById("alertsContainer");

    if (!container) {
        container = document.createElement("div");
        container.id = "alertsContainer";
        container.style.position = "fixed";
        container.style.top = "20px";
        container.style.right = "20px";
        container.style.zIndex = "9999";
        container.style.width = "300px";
        document.body.appendChild(container);
    }

    // Crear alerta
    const alert = document.createElement("div");
    alert.className = `alert alert-${type} shadow fade show mb-2`;
    alert.role = "alert";
    alert.innerHTML = `
        <div>${message}</div>
    `;

    container.appendChild(alert);

    // Desvanecer suavemente
    setTimeout(() => {
        alert.classList.remove("show");
        alert.classList.add("fade");

        setTimeout(() => {
            alert.remove();
        }, 300);

    }, 2500);
}
