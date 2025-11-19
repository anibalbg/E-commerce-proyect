const API_BASE_URL = "http://127.0.0.1:8000/api";

async function apiFetch(endpoint, options = {}) {
    const token = localStorage.getItem("token");

    const headers = options.headers ? { ...options.headers } : {};

    // Solo ponemos Content-Type JSON si el body NO es FormData
    if (!(options.body instanceof FormData)) {
        headers["Content-Type"] = headers["Content-Type"] || "application/json";
    }

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    // Clonamos la respuesta para poder leer el body una vez SIN romper el stream
    const clone = response.clone();
    let rawText = "";
    try {
        rawText = await clone.text();
    } catch (e) {
        rawText = "";
    }

    const contentType = response.headers.get("Content-Type") || "";
    let data = null;

    if (contentType.includes("application/json") && rawText) {
        try {
            data = JSON.parse(rawText);
        } catch (e) {
            data = null;
        }
    } else {
        data = rawText;
    }

    if (!response.ok) {
        const message =
            data && typeof data === "object" && data.message
                ? data.message
                : `Error ${response.status}`;
        console.error("⚠ Backend respondió error:", rawText);
        throw new Error(message);
    }

    return data;
}
