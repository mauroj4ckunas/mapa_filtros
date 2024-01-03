const organizacionesMock = [
    {
        id: 1,
        nombre_organizacion: 'Fundación Ayuda',
        provincia: 'Buenos Aires',
        localidad: 'La Plata',
        tipo_organizacion: 'Comunitaria',
        direccion: 'Calle Falsa 123',
        nro_contacto: '1122334455',
        email: 'contacto@fundacionayuda.org',
        redes: 'facebook.com/fundacionayuda',
        info_adicional: 'Brindamos asistencia a personas en situación de calle.',
        asistencia_alojamiento: 1,
        asistencia_higiene: 1,
        asistencia_salud: 0,
        asistencia_alimentacion: 1,
        asistencia_recreacion: 0,
        genero_mujeres_cis: 1,
        genero_varones_cis: 1,
        genero_lbgtiq: 0,
        edades: 'Todas las edades',
        dias_horarios: 'Lunes a Viernes de 9 a 18 hs',
        latitud: "-34.92145",
        longitud: "-57.95433",
    },
    {
        id: 2,
        nombre_organizacion: 'Centro de Apoyo Integral',
        provincia: 'Santa Fe',
        localidad: 'Rosario',
        tipo_organizacion: 'Gubernamental',
        direccion: 'Av. Siempre Viva 456',
        nro_contacto: '1199887766',
        email: 'info@caintegral.org',
        redes: 'twitter.com/caintegral',
        info_adicional: 'Centro de apoyo para jóvenes y adultos.',
        asistencia_alojamiento: 0,
        asistencia_higiene: 1,
        asistencia_salud: 1,
        asistencia_alimentacion: 0,
        asistencia_recreacion: 1,
        genero_mujeres_cis: 1,
        genero_varones_cis: 1,
        genero_lbgtiq: 1,
        edades: '18 a 60 años',
        dias_horarios: 'Lunes a Sábado de 8 a 20 hs',
        latitud: -32.94424,
        longitud: -60.65054,
    },
    {
        id: 3,
        nombre_organizacion: 'Refugio Esperanza',
        provincia: 'Córdoba',
        localidad: 'Córdoba',
        tipo_organizacion: 'Religiosa',
        direccion: 'Ruta 20 Km 5',
        nro_contacto: '1155667788',
        email: 'contacto@refugioesperanza.org',
        redes: 'instagram.com/refugioesperanza',
        info_adicional: 'Ofrecemos alojamiento y comida a personas sin hogar.',
        asistencia_alojamiento: 1,
        asistencia_higiene: 1,
        asistencia_salud: 1,
        asistencia_alimentacion: 1,
        asistencia_recreacion: 1,
        genero_mujeres_cis: 0,
        genero_varones_cis: 0,
        genero_lbgtiq: 1,
        edades: 'Mayores de 18 años',
        dias_horarios: 'Todos los días 24 hs',
        latitud: -31.42008,
        longitud: -64.18878,
    },
    {
        id: 4,
        nombre_organizacion: 'Refugio Esperanza',
        provincia: 'Córdoba',
        localidad: 'Córdoba',
        tipo_organizacion: 'Religiosa',
        direccion: 'Ruta 20 Km 5',
        nro_contacto: '1155667788',
        email: 'contacto@refugioesperanza.org',
        redes: 'instagram.com/refugioesperanza',
        info_adicional: 'Ofrecemos alojamiento y comida a personas sin hogar.',
        asistencia_alojamiento: 1,
        asistencia_higiene: 1,
        asistencia_salud: 1,
        asistencia_alimentacion: 1,
        asistencia_recreacion: 1,
        genero_mujeres_cis: 0,
        genero_varones_cis: 0,
        genero_lbgtiq: 1,
        edades: 'Mayores de 18 años',
        dias_horarios: 'Todos los días 24 hs',
        latitud: -31.42008,
        longitud: -64.18878,
    },
    {
        id: 5,
        nombre_organizacion: 'Refugio Esperanza',
        provincia: 'Córdoba',
        localidad: 'Córdoba',
        tipo_organizacion: 'Religiosa',
        direccion: 'Ruta 20 Km 5',
        nro_contacto: '1155667788',
        email: 'contacto@refugioesperanza.org',
        redes: 'instagram.com/refugioesperanza',
        info_adicional: 'Ofrecemos alojamiento y comida a personas sin hogar.',
        asistencia_alojamiento: 1,
        asistencia_higiene: 1,
        asistencia_salud: 1,
        asistencia_alimentacion: 1,
        asistencia_recreacion: 1,
        genero_mujeres_cis: 0,
        genero_varones_cis: 0,
        genero_lbgtiq: 1,
        edades: 'Mayores de 18 años',
        dias_horarios: 'Todos los días 24 hs',
        latitud: -31.42008,
        longitud: -64.18878,
    },
    {
        id: 6,
        nombre_organizacion: 'Refugio Esperanza',
        provincia: 'Córdoba',
        localidad: 'Córdoba',
        tipo_organizacion: 'Religiosa',
        direccion: 'Ruta 20 Km 5',
        nro_contacto: '1155667788',
        email: 'contacto@refugioesperanza.org',
        redes: 'instagram.com/refugioesperanza',
        info_adicional: 'Ofrecemos alojamiento y comida a personas sin hogar.',
        asistencia_alojamiento: 1,
        asistencia_higiene: 1,
        asistencia_salud: 1,
        asistencia_alimentacion: 1,
        asistencia_recreacion: 1,
        genero_mujeres_cis: 0,
        genero_varones_cis: 0,
        genero_lbgtiq: 1,
        edades: 'Mayores de 18 años',
        dias_horarios: 'Todos los días 24 hs',
        latitud: -31.42008,
        longitud: -64.18878,
    }
];


document.addEventListener('DOMContentLoaded', function() {
    const listado1 = document.getElementById('listado1');
    const listado2 = document.getElementById('listado2');

    organizacionesMock.forEach((org, index) => {
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


function guardarEnSessionStorage(id) {
    const organizacionEditar = organizacionesMock.find(org => org.id === id);
    sessionStorage.setItem('organizacion-editar', JSON.stringify(organizacionEditar));
    window.location.href = '/src/editor/form-editar/index.html';
}