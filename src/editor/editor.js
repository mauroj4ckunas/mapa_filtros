const url_base = 'http://localhost:3000'

const obtenerOrganizacionesValidadas = async () => {
    const res = await fetch(`${url_base}/organizaciones/validadas`);
    if (res.ok) {
        return await res.json();;
    }
    return []
}

let organizaciones = [];

document.addEventListener('DOMContentLoaded', function() {
    const listado1 = document.getElementById('listado1');
    const listado2 = document.getElementById('listado2');

    obtenerOrganizacionesValidadas().then(data => {
        organizaciones = data;

        organizaciones.forEach((org, index) => {
            const li = document.createElement('div');
            li.classList.add('list-group-item');
    
            const contenido = `
                <h5 class="titulo">${org.nombre_organizacion}</h5>
                <p><span class="subtitulo">Provincia</span>: ${org.provincia}</p>
                <p><span class="subtitulo">Tipo de Organización</span>: ${org.tipo_organizacion}</p>
                <p><span class="subtitulo">Dirección</span>: ${org.direccion}</p>
                <div class="contenedor-btn">
                    <button class="btn btn-success" onclick="guardarEnSessionStorage(${org.id})">Editar</button>
                </div>
            `;
    
            li.innerHTML = contenido;
            if (index % 2 === 0) {
                listado1.appendChild(li);
            } else {
                listado2.appendChild(li);
            }
        });
    });
});


function guardarEnSessionStorage(id) {
    const organizacionEditar = organizaciones.find(org => org.id === id);
    sessionStorage.setItem('organizacion-editar', JSON.stringify(organizacionEditar));
    window.location.href = '/src/editor/form-editar/index.html';
}