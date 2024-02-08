
document.addEventListener("DOMContentLoaded", () => {
    const usuario = sessionStorage.getItem("usuario");

    const host = "http://127.0.0.1:5500";

    const paginas = document.getElementById("paginas");
    const span = document.createElement("span");
    const a = document.createElement("a");
    a.classList.add("text-decoration-none");

    if (usuario) {
        a.href = host + "/src/admin/index.html";
        a.textContent = "Registros";
    } else {
        a.href = host + "/src/login/index.html";
        a.textContent = "Iniciar Sesión";
    }

    span.appendChild(a);
    paginas.appendChild(span);
});