
document.getElementById("registros-btn").addEventListener("click", () => {
    const usuario = sessionStorage.getItem("usuario");
    if (usuario) {
        window.location.href = "/src/admin/index.html";
        return;
    }
    window.location.href = "/src/login/index.html";
});