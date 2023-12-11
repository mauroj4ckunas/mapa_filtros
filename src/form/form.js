"use strict";
document.addEventListener('DOMContentLoaded', function() {

    // Escucha el evento change en el checkbox
    document.getElementById('sinInfoAdicional').addEventListener('change', function() {
        const infoAdicionalTextarea = document.getElementById('infoAdicional');
        infoAdicionalTextarea.disabled = this.checked; // Deshabilita si el checkbox está marcado
        if (this.checked) {
            infoAdicionalTextarea.value = ''; // Limpia el valor si está deshabilitado
        }
    });

    document.getElementById('formRegistro').addEventListener('submit', function(event) {
        event.preventDefault(); // Previene el envío normal del formulario

        // Crear un objeto para almacenar los datos del formulario
        const formData = {
            nombre_organizacion: document.getElementById('nombreOrganizacion').value,
            provincia: document.getElementById('provincia').value,
            localidad: document.getElementById('localidad').value,
            tipo_organizacion: document.getElementById('tipoOrganizacion').value,
            direccion: document.getElementById('direccion').value,
            nro_contacto: document.getElementById('numeroContacto').value,
            email: document.getElementById('email').value,
            redes: document.getElementById('redes').value,
            info_adicional: document.getElementById('infoAdicional').value,
            asistencia_alojamiento: document.getElementById('alojamiento').checked ? 1 : 0,
            asistencia_higiene: document.getElementById('higiene').checked ? 1 : 0,
            asistencia_salud: document.getElementById('salud').checked ? 1 : 0,
            asistencia_alimentacion: document.getElementById('alimentacion').checked ? 1 : 0,
            asistencia_recreacion: document.getElementById('recreacion').checked ? 1 : 0,
            genero_mujeres_cis: document.getElementById('mujeresCis').checked ? 1 : 0,
            genero_varones_cis: document.getElementById('varonesCis').checked ? 1 : 0,
            genero_lbgtiq: document.getElementById('lgbtiqPlus').checked ? 1 : 0,
            edades: document.getElementById('edades').value,
            dias_horarios: document.getElementById('diasHorarios').value,
            latitud: null,
            longitud: null,
        };

        // Aquí puedes procesar formData como necesites, por ejemplo, mostrar en consola
        console.log(formData);
    });
});