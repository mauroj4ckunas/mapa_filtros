

const validarForm = async (id) => {
    const res = await fetch(`http://localhost:3000/organizaciones/${id}/validar`, {
      method: 'PUT'
    });
    return await res.json(); 
}

const editForm = async (id, data) => {
  const res = await fetch(`http://localhost:3000/organizaciones/${id}/editar`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application-json'
    },
    body: JSON.stringify(data),
  });
  return await res.json(); 
}

const orgJSON = sessionStorage.getItem("organizacion-validar");

if (!orgJSON) {
  window.location.href = "/src/admin/index.html";
  alert("Elija un registro para validar.");
}

const organizacionAValidar = JSON.parse(orgJSON);

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
    document.getElementById('recorridas').checked = !!organizacionAValidar.asistencia_recorridas;
    document.getElementById('mujeresCis').checked = !!organizacionAValidar.genero_mujeres_cis;
    document.getElementById('varonesCis').checked = !!organizacionAValidar.genero_varones_cis;
    document.getElementById('lgbtiqPlus').checked = !!organizacionAValidar.genero_lbgtiq;
    document.getElementById('edades').value = organizacionAValidar.edades;
    document.getElementById('diasHorarios').value = organizacionAValidar.dias_horarios;
    document.getElementById('latitud').value = organizacionAValidar.latitud;
    document.getElementById('longitud').value = organizacionAValidar.longitud;

    const btnRechazar = document.querySelector('.btn-rechazar');

    btnRechazar.addEventListener('click', function() {
        sessionStorage.removeItem("organizacion-validar");
        window.location.href = "/src/validador/index.html";
    });

    document.getElementById('formAValidar').addEventListener('submit', function(event) {
        event.preventDefault(); // Previene el envío normal del formulario

        const latitud = document.getElementById('latitud');
        const longitud = document.getElementById('longitud');

        if (!(latitud.value) || !(longitud.value)) {
          alert("Debe validar o intentar nuevamente seleccionar la dirección del lugar")
          return;
        }

        const prov = document.getElementById('provincia').value;
        if (prov === 'none') {
          alert("Debe seleccionar una provincia.");
          return;
        }

        // Crear un objeto para almacenar los datos del formulario
        const formData = {
            nombre_organizacion: document.getElementById('nombreOrganizacion').value,
            provincia: prov,
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
            asistencia_recorridas: document.getElementById('recorridas').checked ? 1 : 0,
            genero_mujeres_cis: document.getElementById('mujeresCis').checked ? 1 : 0,
            genero_varones_cis: document.getElementById('varonesCis').checked ? 1 : 0,
            genero_lbgtiq: document.getElementById('lgbtiqPlus').checked ? 1 : 0,
            edades: document.getElementById('edades').value,
            dias_horarios: document.getElementById('diasHorarios').value,
            latitud: Number(latitud.value),
            longitud: Number(longitud.value),
            validada: 1,
        };
        
        editForm(organizacionAValidar.id, formData).then(data => {
          window.location.href = "/src/validador/index.html";
          if ('error' in data) {
            alert(data.error)
            return;
          }
          alert("El formulario fue validado")
        })
        
        return;
    });
});

let map;
let marker;
let geocoder;
let latitudSeleccionado = null;
let longitudSeleccionado = null;

const btnBorrar = document.querySelector("#btn-borrar");
const buscador = document.querySelector("#direccion");
const opciones = document.querySelector("#opciones");
const latitud = document.getElementById('latitud');
const longitud = document.getElementById('longitud');

const checkboxContainer = document.createElement('div');
checkboxContainer.id = 'checkbox-container';

const checkbox = document.createElement('input');
checkbox.type = 'checkbox';
checkbox.id = 'direccion-correcta';
checkbox.name = 'direccionCorrecta';
checkbox.checked = true;

const label = document.createElement('label');
label.htmlFor = 'direccion-correcta';
label.textContent = 'Validar dirección';

checkboxContainer.appendChild(checkbox);
checkboxContainer.appendChild(label);

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: { lat: Number(organizacionAValidar.latitud), lng: Number(organizacionAValidar.longitud) },
        mapTypeControl: false,
    });
    geocoder = new google.maps.Geocoder();
    marker = new google.maps.Marker({
            position: { lat: Number(organizacionAValidar.latitud), lng: Number(organizacionAValidar.longitud) },
            map,
    });

  map.controls[google.maps.ControlPosition.LEFT_TOP].push(checkboxContainer);

  buscador.addEventListener("input", (e) => {
    opciones.innerHTML = '';
    if (document.getElementById('map').classList.contains('map-visible')) {
      document.getElementById('map').classList.remove('map-visible');
      document.getElementById('map').classList.add('map-hidden');
    }
    geocode({ address: buscador.value })
  });

  btnBorrar.addEventListener("click", () => {
    document.getElementById('map').classList.remove('map-visible');
    document.getElementById('map').classList.add('map-hidden');
    buscador.value = '';
    opciones.innerHTML = '';
    clear();
  });

  checkbox.addEventListener('change', (c) => {
    if (checkbox.checked && latitudSeleccionado !== null && longitudSeleccionado !== null) {
      latitud.value = latitudSeleccionado;
      longitud.value = longitudSeleccionado;
    } else {
      latitud.value = "";
      longitud.value = "";
    }
  });
}

function clear() {
  latitud.value = '';
  longitud.value = '';
  latitudSeleccionado = null;
  longitudSeleccionado = null;
  marker.setMap(null);
  checkbox.checked = false;
}

function geocode(request) {
  clear();
  geocoder
    .geocode(request)
    .then((result) => {
      const { results } = result;
  
      results.forEach(res => {
        const opcionDiv = document.createElement('div');

        opcionDiv.addEventListener('click', () => {
          opciones.innerHTML = '';
          map.setCenter(res.geometry.location);
          marker.setPosition(res.geometry.location);
          marker.setMap(map);
          map.setZoom(15);

          latitudSeleccionado = res.geometry.location.lat();
          longitudSeleccionado = res.geometry.location.lng();
          checkbox.checked = false;
          checkbox.disabled = false;

          document.getElementById('map').classList.remove('map-hidden');
          document.getElementById('map').classList.add('map-visible');
        });

        opcionDiv.className = 'opcion';
        opcionDiv.textContent = res.formatted_address;
        opciones.appendChild(opcionDiv);
      });

      return results;
    })
    .catch((e) => {
      
    });
}

window.initMap = initMap;