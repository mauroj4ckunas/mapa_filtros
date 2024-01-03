
document.addEventListener('DOMContentLoaded', function() {
    const usuario = sessionStorage.getItem("usuario");
    if (!usuario) {
        window.location.href = "/src/login/index.html";
        return;
    }
});