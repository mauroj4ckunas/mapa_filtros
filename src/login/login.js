
document.addEventListener('DOMContentLoaded', function() {
    const usuario = sessionStorage.getItem("usuario");
    if (usuario) {
        window.location.href = "/src/admin/index.html";
        return;
    }
    document.getElementById('formLogin').addEventListener('submit', function(event) {
        event.preventDefault(); 
        const user = document.getElementById('usuario').value;
        const password = document.getElementById('contrasena').value;

        if (!user || !password) {
            alert("Debe indicar su usuario y su contraseña para iniciar sesión");
            return;
        }

        const loginData = {
            user: user,
            password: password,
        };

        sessionStorage.setItem("usuario", JSON.stringify(loginData));

        window.location.href = "/src/admin/index.html";
    });
});