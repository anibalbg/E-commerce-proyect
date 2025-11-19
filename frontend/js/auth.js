// ================================
//         Helpers comunes
// ================================
function getInputValue(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : "";
}

function notify(message, type = "danger") {
    // Si existe showAlert (index.html o alerts.js), lo usamos.
    if (typeof showAlert === "function") {
        showAlert(message, type);
    } else {
        // Fallback para páginas viejas (auth.html, etc.)
        alert(message);
    }
}

// ================================
//            LOGIN
// ================================
async function login() {
    // Soporta tanto index.html (loginEmail/loginPassword)
    // como auth.html antiguo (email/password)
    const email =
        getInputValue("loginEmail") || getInputValue("email");
    const password =
        getInputValue("loginPassword") || getInputValue("password");

    if (!email || !password) {
        notify("Introduce correo y contraseña", "danger");
        return;
    }

    try {
        const res = await apiFetch("/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });

        // Guardar token y usuario
        localStorage.setItem("token", res.access_token);
        localStorage.setItem("user", JSON.stringify(res.user));

        notify("Inicio de sesión exitoso ✔", "success");

        // Redirigir tras 1 segundo
        setTimeout(() => {
            window.location.href = "home.html";
        }, 1000);
    } catch (err) {
        notify("Error al iniciar sesión: " + err.message, "danger");
    }
}

// ================================
//          REGISTRO
// ================================
async function register() {
    // Soporta index.html (regName/regEmail/regPassword)
    // y auth.html antiguo (name/regEmail/regPassword)
    const name =
        getInputValue("regName") || getInputValue("name");
    const email = getInputValue("regEmail");
    const password = getInputValue("regPassword");

    if (!name || !email || !password) {
        notify("Rellena nombre, email y contraseña", "danger");
        return;
    }

    try {
        await apiFetch("/register", {
            method: "POST",
            body: JSON.stringify({
                name,
                email,
                password,
                password_confirmation: password,
            }),
        });

        notify("Registro exitoso. Ahora inicia sesión ✔", "success");

        // Si existe showLogin (definido en index.html) volvemos a la pestaña de login
        if (typeof showLogin === "function") {
            showLogin();
        }
    } catch (err) {
        notify("Error en registro: " + err.message, "danger");
    }
}
