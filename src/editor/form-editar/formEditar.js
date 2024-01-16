

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

const orgJSON = sessionStorage.getItem("organizacion-editar");

if (!orgJSON) {
  window.location.href = "/src/admin/index.html";
  alert("Elija un registro para editar.");
}

const organizacionAEditar = JSON.parse(orgJSON);

document.addEventListener('DOMContentLoaded', function() {

    // Asignar valores a los campos del formulario
    document.getElementById('nombreOrganizacion').value = organizacionAEditar.nombre_organizacion;
    document.getElementById('provincia').value = organizacionAEditar.provincia;
    document.getElementById('localidad').value = organizacionAEditar.localidad;
    document.getElementById('tipoOrganizacion').value = organizacionAEditar.tipo_organizacion;
    document.getElementById('direccion').value = organizacionAEditar.direccion;
    document.getElementById('numeroContacto').value = organizacionAEditar.nro_contacto;
    document.getElementById('email').value = organizacionAEditar.email;
    document.getElementById('redes').value = organizacionAEditar.redes;
    document.getElementById('infoAdicional').value = organizacionAEditar.info_adicional;
    document.getElementById('alojamiento').checked = !!organizacionAEditar.asistencia_alojamiento;
    document.getElementById('higiene').checked = !!organizacionAEditar.asistencia_higiene;
    document.getElementById('salud').checked = !!organizacionAEditar.asistencia_salud;
    document.getElementById('alimentacion').checked = !!organizacionAEditar.asistencia_alimentacion;
    document.getElementById('recreacion').checked = !!organizacionAEditar.asistencia_recreacion;
    document.getElementById('recorridas').checked = !!organizacionAEditar.asistencia_recorridas;
    document.getElementById('mujeresCis').checked = !!organizacionAEditar.genero_mujeres_cis;
    document.getElementById('varonesCis').checked = !!organizacionAEditar.genero_varones_cis;
    document.getElementById('lgbtiqPlus').checked = !!organizacionAEditar.genero_lbgtiq;
    document.getElementById('edades').value = organizacionAEditar.edades;
    document.getElementById('diasHorarios').value = organizacionAEditar.dias_horarios;
    document.getElementById('latitud').value = organizacionAEditar.latitud;
    document.getElementById('longitud').value = organizacionAEditar.longitud;

    const btnVolver = document.querySelector('.btn-volver');

    btnVolver.addEventListener('click', function() {
        sessionStorage.removeItem("organizacion-editar");
        window.location.href = "/src/editor/index.html";
        alert('Estás volviendo.');
    });

    document.getElementById('formAEditar').addEventListener('submit', function(event) {
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

        editForm(organizacionAEditar.id, formData).then(data => {
          sessionStorage.removeItem("organizacion-editar");
          window.location.href = "/src/editor/index.html";
          if ('error' in data) {
            alert(data.error)
            return;
          }
          alert("El formulario fue editado")
        })
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
        center: { lat: Number(organizacionAEditar.latitud), lng: Number(organizacionAEditar.longitud) },
        mapTypeControl: false,
    });
    geocoder = new google.maps.Geocoder();
    marker = new google.maps.Marker({
            position: { lat: Number(organizacionAEditar.latitud), lng: Number(organizacionAEditar.longitud) },
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
          map.setCenter(Number(res.geometry.location));
          marker.setPosition(Number(res.geometry.location));
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