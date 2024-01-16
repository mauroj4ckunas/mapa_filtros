
document.addEventListener("DOMContentLoaded", () => {
    const usuario = sessionStorage.getItem("usuario");

    const paginas = document.getElementById("paginas");
    const span = document.createElement("span");
    const a = document.createElement("a");
    a.classList.add("text-decoration-none");

    if (usuario) {
        a.href = "/src/admin/index.html";
        a.textContent = "Registros";
    } else {
        a.href = "/src/login/index.html";
        a.textContent = "Iniciar Sesión";
    }

    span.appendChild(a);
    paginas.appendChild(span);
});