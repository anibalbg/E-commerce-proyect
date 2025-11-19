// ================================================
//            GolfStore - admin-users.js
// ================================================

async function loadUsers() {
    try {
        const users = await apiFetch("/users");
        renderUsers(users);
    } catch (err) {
        showAlert("Error al cargar usuarios: " + err.message, "danger");
    }
}

function renderUsers(users) {
    const container = document.getElementById("usersContainer");
    const emptyMsg = document.getElementById("emptyMsg");

    container.innerHTML = "";
    emptyMsg.innerHTML = "";

    if (!users || users.length === 0) {
        emptyMsg.innerHTML = "No hay usuarios registrados.";
        return;
    }

    let html = `
        <div class="admin-table">
            <table class="table mb-0">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Admin</th>
                    </tr>
                </thead>
                <tbody>
    `;

    users.forEach(u => {
        html += `
            <tr>
                <td>${u.id}</td>
                <td>${u.name}</td>
                <td>${u.email}</td>
                <td>${u.is_admin ? "✔ Sí" : "No"}</td>
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
 