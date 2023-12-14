const organizacionAValidar = {
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
    latitud: -34.92145,
    longitud: -57.95433,
};

document.addEventListener('DOMContentLoaded', function() {

    // Asignar valores a los campos del formulario
    document.getElementById('nombreOrganizacion').value = organizacionAValidar.nombre_organizacion;
    document.getElementById('provincia').value = organizacionAValidar.provincia;
    document.getElementById('localidad').value = organizacionAValidar.localidad;
    document.getElementById('tipoOrganizacion').value = organizacionAValidar.tipo_organizacion;
    document.getElementById('direccion').value = organizacionAValidar.direccion;
    document.getElementById('numeroContacto').value = organizacionAValidar.nro_contacto;
    document.getElementById('email').value = organizacionAValidar.email;
    document.getElementById('redes').value = organizacionAValidar.redes;
    document.getElementById('infoAdicional').value = organizacionAValidar.info_adicional;
    document.getElementById('alojamiento').checked = !!organizacionAValidar.asistencia_alojamiento;
    document.getElementById('higiene').checked = !!organizacionAValidar.asistencia_higiene;
    document.getElementById('salud').checked = !!organizacionAValidar.asistencia_salud;
    document.getElementById('alimentacion').checked = !!organizacionAValidar.asistencia_alimentacion;
    document.getElementById('recreacion').checked = !!organizacionAValidar.asistencia_recreacion;
    document.getElementById('mujeresCis').checked = !!organizacionAValidar.genero_mujeres_cis;
    document.getElementById('varonesCis').checked = !!organizacionAValidar.genero_varones_cis;
    document.getElementById('lgbtiqPlus').checked = !!organizacionAValidar.genero_lbgtiq;
    document.getElementById('edades').value = organizacionAValidar.edades;
    document.getElementById('diasHorarios').value = organizacionAValidar.dias_horarios;
    document.getElementById('latitud').value = organizacionAValidar.latitud;
    document.getElementById('longitud').value = organizacionAValidar.longitud;

    const btnValidar = document.querySelector('.btn-validar');
    const btnRechazar = document.querySelector('.btn-rechazar');

    btnValidar.addEventListener('click', function() {
        alert('Estás validando la solicitud.');
    });

    btnRechazar.addEventListener('click', function() {
        alert('Estás rechazando la solicitud.');
    });
});

function initMap() {

    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 15,
      center: { lat: organizacionAValidar.latitud, lng: organizacionAValidar.longitud },
      mapTypeControl: false,
    });
    const marker = new google.maps.Marker({
       position: { lat: organizacionAValidar.latitud, lng: organizacionAValidar.longitud },
       map,
    });
}


window.initMap = initMap;