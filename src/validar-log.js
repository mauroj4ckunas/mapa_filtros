
document.addEventListener('DOMContentLoaded', function() {
    const usuario = sessionStorage.getItem("usuario");
    if (!usuario) {
        window.location.href = "mapa_obs/src/login/index.html";
        return;
    }
});