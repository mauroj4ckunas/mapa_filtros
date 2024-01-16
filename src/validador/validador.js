import { url_base } from "../../env";

const obtenerOrganizacionesNoValidadas = async () => {
    const res = await fetch(`${url_base}/organizaciones/no-validadas`);
    if (res.ok) {
        return await res.json();;
    }
    return []
}

let organizaciones = [];

document.addEventListener('DOMContentLoaded', () => {
    const listado1 = document.getElementById('listado1');
    const listado2 = document.getElementById('listado2');

    obtenerOrganizacionesNoValidadas().then(data => {
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
                    <button class="btn btn-primary" onclick="guardarEnSessionStorage(${org.id})">Validar</button>
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
    const organizacionValidar = organizaciones.find(org => org.id === id);
    sessionStorage.setItem('organizacion-validar', JSON.stringify(organizacionValidar));
    window.location.href = '/src/validador/form-validar/index.html';
}