import { url_base } from "../../env";


const crearRegistro = async (data) => {
    const res = await fetch(`${url_base}/organizaciones`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    });
    return await res.json(); 
}

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

        const latitud = document.getElementById('latitud');
        const longitud = document.getElementById('longitud');

        if (!(latitud.value) || !(longitud.value)) {
          alert("Debe validar o intentar nuevamente seleccionar la dirección del lugar")
          return;
        }

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
            asistencia_recorridas: document.getElementById('recorridas').checked ? 1 : 0,
            genero_mujeres_cis: document.getElementById('mujeresCis').checked ? 1 : 0,
            genero_varones_cis: document.getElementById('varonesCis').checked ? 1 : 0,
            genero_lbgtiq: document.getElementById('lgbtiqPlus').checked ? 1 : 0,
            edades: document.getElementById('edades').value,
            dias_horarios: document.getElementById('diasHorarios').value,
            latitud: Number(latitud.value),
            longitud: Number(longitud.value),
            validada: 0,
        };

        crearRegistro(formData).then(data => {
          if ('error' in data) {
            alert(data.error);
            return;
          }
          alert('Se creó un nuevo registro.');
          window.location.href = "/src/map/index.html";
          return;
        });
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

const label = document.createElement('label');
label.htmlFor = 'direccion-correcta';
label.textContent = 'Validar dirección';

checkboxContainer.appendChild(checkbox);
checkboxContainer.appendChild(label);

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 8,
    center: { lat: -34.14632380351894, lng: -64.01189688308897 },
    mapTypeControl: false,
  });
  geocoder = new google.maps.Geocoder();
  marker = new google.maps.Marker({
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

  clear();
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