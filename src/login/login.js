

const login = async (credenciales) => {
    const res = await fetch(`http://191.101.71.110:3000/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credenciales),
    });

    if (res.status === 404) return { error: 'Nombre de usuario no encontrado' };
    
    if (res.status === 401) return { error: 'Credenciales incorrecta' };

    return await res.json();
}


document.addEventListener('DOMContentLoaded', function() {
    const usuario = sessionStorage.getItem("usuario");
    if (usuario) {
        window.location.href = "/src/admin/index.html";
        return;
    }

    document.getElementById('formLogin').addEventListener('submit', async (event) => {
        event.preventDefault(); 
        const nombre_usuario = document.getElementById('usuario').value;
        const password = document.getElementById('contrasena').value;

        if (!nombre_usuario || !password) {
            alert("Debe indicar su usuario y su contraseña para iniciar sesión");
            return;
        }

        login({nombre_usuario, password}).then(data => {
            if ('error' in data) {
                alert(data.error);
                return;
            }
            const loginData = {
                user: nombre_usuario,
            };
            sessionStorage.setItem("usuario", JSON.stringify(loginData));
            window.location.href = "/src/admin/index.html";
        });
    });
});