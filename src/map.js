import { opcionesFiltros } from "./utils/opcionesFiltros.js";
import { allOrganizaciones } from "./utils/allOrganizaciones.js";
import { filOrganizaciones } from "./utils/filOrganizaciones.js";
import { provincias } from "./utils/filtroProv.js";
import { localidades } from "./utils/filtroLocalidad.js";
import { asistencias } from "./utils/filtroAsistencia.js";
// import { data } from "./utils/mock.js";

const map = L.map('map', {zoomControl: false});
const markerGroup = L.layerGroup();
let sidebar = L.control.sidebar({
    autopan: false,       
    closeButton: true,    
    container: 'sidebar', 
    position: 'left',     
}).addTo(map);

async function addAllMarkerFromBD() {
    const loading = `
    <div class="d-flex justify-content-center align-items-center">
        <div class="fa fa-circle-o-notch fa-4x fa-spin text-dark" role="status">
            <span class="sr-only">Cargando...</span>
        </div>
    </div>
    `;
    const iconLoading = L.divIcon({
        className: 'custom-div-icon',
        html: loading,
        iconSize: [100, 100]
    });
    const cargandoOrganizaciones = L.marker([-34.5559, -64.0166], { icon: iconLoading });
    cargandoOrganizaciones.addTo(map);

    await allOrganizaciones()
        .then(data => {
            drawMarkerOrganizacion(data);
            map.removeLayer(cargandoOrganizaciones);
            markerGroup.addTo(map);
        })
        .catch(error => alert("No se pudieron cagar las organizaciones"))
}

const drawMarkerOrganizacion = (organizaciones) => {
    organizaciones.forEach(d => {
        const marker = L.marker([Number(d.latitud), Number(d.longitud)]).bindPopup(`
            <div class="container">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title text-center"><i class="fa fa-building"></i> ${d.nombre_organizacion}</h5>
                        <p class="card-text"><i class="fa fa-map-marker"></i> <span class="font-weight-bold text-info">Provincia</span>: ${d.provincia}</p>
                        <p class="card-text"><i class="fa fa-map-o"></i> <span class="font-weight-bold text-info">Localidad</span>: ${d.localidad}</p>
                        <p class="card-text"><i class="fa fa-users"></i> <span class="font-weight-bold text-info">Tipo de Organización</span>: ${d.tipo_organizacion}</p>
                        <p class="card-text"><i class="fa fa-home"></i> <span class="font-weight-bold text-info">Dirección</span>: ${d.direccion ? d.direccion : 'Dirección no cargada'}</p>
                        <p class="card-text"><i class="fa fa-phone"></i> <span class="font-weight-bold text-info">Número</span>: ${d.nro_contacto ? d.nro_contacto : 'Sin número de contacto'}</p>
                        <p class="card-text"><i class="fa fa-envelope"></i> <span class="font-weight-bold text-info">Email</span>: ${d.email ? d.email : 'Sin email de contacto'}</p>
                        <p class="card-text"><i class="fa fa-hashtag"></i> <span class="font-weight-bold text-info">Redes</span>: ${d.redes ? d.redes : 'Sin redes'}</p>
                        <p class="card-text"><i class="fa fa-info-circle"></i> <span class="font-weight-bold text-info">Información Adicional</span>: ${d.info_adicional ? d.info_adicional : 'Sin datos'}</p>
                        <p class="card-text"><i class="fa fa-handshake-o"></i> <span class="font-weight-bold text-info">Tipo de Asistencia</span>: ${tiposAsistencia({
                            asistencia_alimentacion: d.asistencia_alimentacion,
                            asistencia_alojamiento: d.asistencia_alojamiento,
                            asistencia_higiene: d.asistencia_higiene,
                            asistencia_recorridas: d.asistencia_recorridas,
                            asistencia_recreacion: d.asistencia_recreacion,
                            asistencia_salud: d.asistencia_salud
                        })}</p>
                        <p class="card-text"><i class="fa fa-venus-mars"></i> <span class="font-weight-bold text-info">Género</span>: ${generos({  
                            genero_lbgtiq: d.genero_lbgtiq,
                            genero_mujeres_cis: d.genero_mujeres_cis,
                            genero_varones_cis: d.genero_varones_cis,
                        })}</p>
                        <p class="card-text"><i class="fa fa-child"></i> <span class="font-weight-bold text-info">Edades</span>: ${d.edades ? d.edades : '-'}</p>
                        <p class="card-text"><i class="fa fa-clock-o"></i> <span class="font-weight-bold text-info">Días y Horarios</span>: ${d.dias_horarios ? d.dias_horarios : '-'}</p>
                    </div>
                </div>
            </div>
        `);
        marker.on('click', function () {
            const zoomLevel = 12;
            const latLng = marker.getLatLng();
            const popupOffset = 0.09; 
            const adjustedLatLng = L.latLng([latLng.lat + popupOffset, latLng.lng]);
            map.flyTo(adjustedLatLng, zoomLevel);
        });
        markerGroup.addLayer(marker)
    })
}

const tiposAsistencia = (asistencia) => {
  return Object.keys(asistencia)
        .filter(key => asistencia[key])
        .map(key => {
            return key.split('_').slice(1).join(' ').replace(/\b\w/g, l => l.toUpperCase());
        })
        .join(', ');;
}

const generos = (generos) => {
    return Object.keys(generos)
    .filter(key => generos[key])
    .map(key => {
      return key.split('_').slice(1).map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }).join(' ');
    })
    .join(', ');
}

const setMap = (lat = -34.5559, lng =  -64.0166) => {
    map.setView([lat, lng], 5);

    const baseLayer = L.tileLayer('https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/capabaseargenmap@EPSG%3A3857@png/{z}/{x}/{-y}.png');
    const baseOscuroLayer = L.tileLayer('https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/argenmap_oscuro@EPSG%3A3857@png/{z}/{x}/{-y}.png');
    const baseTopograficoLayer = L.tileLayer('https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/mapabase_topo@EPSG%3A3857@png/{z}/{x}/{-y}.png');

    baseLayer.addTo(map);
    map.attributionControl.setPrefix('Leaflet | &copy; <a href="https://www.ign.gob.ar/">IGN</a> contributors');

    const baseLayers = {
        "Mapa Clásico": baseLayer,
        "Mapa Oscuro": baseOscuroLayer,
        "Mapa Topográfico": baseTopograficoLayer
    };
    L.control.layers(baseLayers, null, { collapsed: false }).addTo(map);

    let zoomHome = L.Control.zoomHome();
    zoomHome.addTo(map);

    addAllMarkerFromBD();
}

setMap();

const showAllMarker = null;


function addMarker(filtros) {
    markerGroup.clearLayers();
    data.forEach(d => {
        let includeMarker = true;

        if (filtros !== null) {
            for (let key in filtros) {
                if (filtros[key] !== null && d[key] !== filtros[key]) {
                    includeMarker = false;
                    break;
                }
            }
        }
        if (includeMarker) {
            const marker = L.marker(d.coordinate).bindPopup(`
                <div class="container">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title text-center"><i class="fa fa-building"></i> ${d.data.nombre}</h5>
                            <p class="card-text"><i class="fa fa-user"></i> <span class="font-weight-bold text-info">Contacto</span>: ${d.data.contacto}</p>
                            <p class="card-text"><i class="fa fa-phone"></i> <span class="font-weight-bold text-info">Número</span>: ${d.data.num_contacto ? d.data.num_contacto : 'Sin número de contacto'}</p>
                            <p class="card-text"><i class="fa fa-envelope"></i> <span class="font-weight-bold text-info">Mail</span>: ${d.data.mail ? d.data.mail : 'Sin mail de contacto'}</p>
                            <p class="card-text"><i class="fa fa-calendar-check-o"></i> <span class="font-weight-bold text-info">Entrevista</span>: ${d.data.entrevista ? 'Hay entrevista' : 'No hay entrevista'}</p>
                            <p class="card-text"><i class="fa fa-wpforms"></i> <span class="font-weight-bold text-info">Formulario</span>: ${d.data.forms ? 'Hay formulario' : 'No hay formulario'}</p>
                            <p class="card-text"><i class="fa fa-user-circle-o"></i> <span class="font-weight-bold text-info">Quien Contacto</span>: ${d.data.quienContacto ? d.data.quienContacto : '-'}</p>
                            <p class="card-text"><i class="fa fa-clock-o"></i> <span class="font-weight-bold text-info">Fecha de Entrevista</span>: ${d.data.fechaEntrevista ? d.data.fechaEntrevista : 'Sin confirmar'}</p>                     
                            <p class="card-text"><i class="fa fa-sitemap"></i> <span class="font-weight-bold text-info">Estrato</span>: ${d.data.estrato ? d.data.estrato : '-'}</p>                  
                            <p class="card-text"><i class="fa fa-university"></i> <span class="font-weight-bold text-info">Tipo de Organización</span>: ${d.data.organizacion ? d.data.organizacion : '-'}</p>                  
                            <p class="card-text"><i class="fa fa-align-left"></i> <span class="font-weight-bold text-info">Descripción</span>: ${d.data.descripcion ? d.data.descripcion : '-'}</p>                
                            ${d.data.linkInfo || d.data.linkInterno ? `
                                <div class="d-flex justify-content-${d.data.linkInfo && d.data.linkInterno ? 'between' : 'center'} mt-3">
                                    ${d.data.linkInfo ? `<a href="${d.data.linkInfo}" class="btn btn-dark text-white" target="_blank">Más Info</a>` : ''}
                                    ${d.data.linkInterno ? `<a href="${d.data.linkInterno}" class="btn btn-dark text-white" target="_blank">Link Interno</a>` : ''}
                                </div>
                            ` : ''}            
                        </div>
                    </div>
                </div>
            `);
            marker.on('click', function () {
                const zoomLevel = 12;
                const latLng = marker.getLatLng();
                const popupOffset = 0.09; 
                const adjustedLatLng = L.latLng([latLng.lat + popupOffset, latLng.lng]);
                map.flyTo(adjustedLatLng, zoomLevel);
            });
            markerGroup.addLayer(marker)
        }
    })
    markerGroup.addTo(map);
}

// addMarker(showAllMarker);

const filtroProvincias = () => provincias.reduce((acu, act) => {
    return acu += `<option value="${act}">${act}</option>`;
}, '')

const filtroLocalidades = () => localidades.reduce((acu, act) => {
    return acu += `<option value="${act}">${act}</option>`;
}, '')

const filtroAsistencia = () => asistencias.reduce((acu, act) => {
    return acu += `<option value="${act}">${act}</option>`;
}, '')

const agregarPanelFiltro = (sidebar, filtros) => {

    const dataFiltrada = data.filter(d => {
        return (filtros.provincia === null || d.provincia === filtros.provincia) &&
               (filtros.localidad === null || d.localidad === filtros.localidad) &&
               (filtros.tipo === null || d.tipo === filtros.tipo);
    });
    const items = dataFiltrada.reduce((acu, act) => {
        return acu += `
            <tr>
                <td><p class="mb-0 font-weight-bold" style="color: #333; font-size: 1rem;">${act.data.nombre}</p></td>
                <td>
                    <button type="button" class="btn btn-info irAlLugar" data-coordinate="${act.coordinate}">
                        Ir al Lugar
                    </button>
                </td>
            </tr>
        `
    }, "");

    const capitalize = str => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    const getInfoPorClave = (obj, clave) => {
        const objPorClave = allFiltros[obj].find(prov => prov.clave === clave);
        return objPorClave.info;
    };

    const filtrosSeleccionados = Object.entries(filtros).filter(([key, value]) => !!value)

    const listFiltros = filtrosSeleccionados.reduce((acu, act) => {
        return acu += `<li class="list-group-item">${capitalize(act[0])}: ${getInfoPorClave(act[0], act[1])}</li>`
    }, "");

    const list = `
        <div class="container my-4 w-full">
            <h4>Filtros seleccionados: <span class="badge badge-secondary">${filtrosSeleccionados.length}</span></h4>
            <ul class="list-group my-2">
                ${listFiltros}
            </ul>
            <table class="table table-striped">
                <thead class="thead-dark">
                <tr>
                    <th scope="col">Organización</th>
                    <th scope="col" class"wx-2">Ver Lugar</th>
                </tr>
                </thead>
                <tbody>
                    ${items}
                </tbody>
            </table>
        </div>
    `;

    const panelFiltro = {
        id: 'panelFiltro',
        tab: '<i class="fa fa-check"></i>',
        pane: list,
        title: `Lugares Filtrados`,
        position: 'top',
    };

    sidebar.addPanel(panelFiltro);
}

function filtros(sidebar) {

    let filtroElegida = {
        provincia: null,
        localidad: null,
        tipo: null,
    };

    const inputs = `
        <div class="container h-100 w-100 my-4">
            <div class="mb-3">
                <label for="selectProvincias" class="form-label">Por Provincia</label>
                <select class="custom-select" id="selectProvincias">
                    <option selected class="d-none">Elije una provincia</option>
                    ${filtroProvincias()}
                    <option value="not" >Sacar Filtro</option>
                </select>
            </div>
            <div class="mb-3">
                <label for="selectLocalidades" class="form-label">Por Localidad</label>
                <select class="custom-select" id="selectLocalidades">
                    <option selected class="d-none">Elije una localidad</option>
                    ${filtroLocalidades()}
                    <option value="not" >Sacar Filtro</option>
                </select>
            </div>
            <div class="mb-3">
                <label for="selectAsistencia" class="form-label">Por Tipo de Asistencia</label>
                <select class="custom-select" id="selectAsistencia">
                    <option selected class="d-none">Elije un tipo</option>
                    ${filtroAsistencia()}
                    <option value="not" >Sacar Filtro</option>
                </select>
            </div>
            <div class="container mt-4">
                <div class="row">
                    <div class="col-sm">
                        <button type="button" class="btn btn-info" id="verSegunFiltro">
                            Ver según filtro
                        </button>
                    </div>
                    <div class="col-sm">
                        <button type="button" class="btn btn-info" id="recargarFiltro">
                            Recargar filtros
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    let panelContent = {
        id: 'panelContent',
        tab: '<i class="fa fa-search"></i>',
        pane: inputs,
        title: 'Aplicar filtros',
        position: 'top',
    };

    sidebar.addPanel(panelContent);

    document.querySelector("#selectProvincias").addEventListener("change", function (e) {
        filtroElegida.provincia = e.target.value = e.target.value === 'not' ? null : e.target.value;;
        addMarker(filtroElegida);
    });

    document.querySelector("#selectLocalidades").addEventListener("change", function (e) {
        filtroElegida.localidad = e.target.value = e.target.value === 'not' ? null : e.target.value;;
        addMarker(filtroElegida);
    });

    document.querySelector("#selectAsistencia").addEventListener("change", function (e) {
        filtroElegida.tipo = e.target.value = e.target.value === 'not' ? null : e.target.value;;
        addMarker(filtroElegida);
    });

    document.querySelector("#verSegunFiltro").addEventListener("click", e => {
        if (filtroElegida) {
            sidebar.removePanel("panelFiltro");
            agregarPanelFiltro(sidebar, filtroElegida);
            document.querySelectorAll('.irAlLugar').forEach(boton => {
                boton.addEventListener('click', function() {
                    const coordinates = this.dataset.coordinate.split(',').map(Number);
                    const popupOffset = 0.01;
                    const adjustedLatLng = L.latLng([coordinates[0] - popupOffset, coordinates[1]]);
                    map.setView(adjustedLatLng, 12);
                    markerGroup.eachLayer(function (marker) {
                        if (marker.getLatLng().equals(L.latLng(coordinates))) {
                            marker.openPopup();
                            return
                        }
                    });
                });
            });
        } else {
            alert("Debe seleccionar un filtro primero")
        }
    });

    document.querySelector("#recargarFiltro").addEventListener("click", e => location.reload());
}

filtros(sidebar);


