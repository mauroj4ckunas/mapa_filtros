
document.addEventListener('DOMContentLoaded', function() {    
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

        console.log(loginData);
        alert("Se está logeando.")
    });
});