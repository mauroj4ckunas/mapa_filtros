import { opcionesFiltros } from "./utils/opcionesFiltros.js";
import { allOrganizaciones } from "./utils/allOrganizaciones.js";
import { filOrganizaciones } from "./utils/filOrganizaciones.js";
// import { data } from "./utils/mock.js";

const map = L.map('map', {zoomControl: false});
const markerGroup = L.layerGroup();

const panelLoading = {
    id: 'panelLoading',
    tab: '<i class="fa fa-spinner fa-spin text-dark"></i>',
    pane: '<p></p>',
    title: '<i>Cargando...</i>',
    position: 'top',
};

const sidebar = L.control.sidebar({
    autopan: false,       
    closeButton: true,    
    container: 'sidebar', 
    position: 'left',     
}).addTo(map)

sidebar.addPanel(panelLoading);

const loadingGroup = L.layerGroup();

const allOptions = {
    provincias: [],
    localidades: [],
    tipos: [],
}
let all;

const addLoading = () => {
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
    loadingGroup.addLayer(cargandoOrganizaciones);
    loadingGroup.addTo(map)
}

async function addAllMarkerFromBD() {
    allOrganizaciones()
        .then(data => {
            drawMarkerOrganizacion(data);
            all = data;
            map.removeLayer(loadingGroup);
            markerGroup.addTo(map);
        })
        .catch(error => alert("No se pudieron cagar las organizaciones"))
}

const drawMarkerOrganizacion = (organizaciones) => {
    organizaciones.forEach(d => {
        let customIcon = L.icon({
            iconUrl: `../public/${
                d.tipo_organizacion === 'Religiosa' ? 'mark_religiosa.png' :
                d.tipo_organizacion === 'Gubernamental' ? 'mark_gubernamental.png' :
                d.tipo_organizacion === 'Comunitaria' ? 'mark_comunitaria.png' :
                d.tipo_organizacion === 'Social y o politica' ? 'mark_soc_pol.png' :
                d.tipo_organizacion === 'Social y/o Politica' ? 'mark_soc_pol.png' :
                'mark_as_civil.png' 
            }`,
            iconSize: [33, 35],
        });
        const marker = L.marker([Number(d.latitud), Number(d.longitud)], { icon: customIcon }).bindPopup(`
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

const showSidebarWithOptions = async () => {
    opcionesFiltros().then(res => {
        allOptions.provincias = res.provincias;
        allOptions.localidades = res.localidades;
        allOptions.tipos = res.tipos;
        filtros();
    })
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

    addLoading();
    addAllMarkerFromBD();
    showSidebarWithOptions();
}

setMap();

function addMarkerFilter({ provincia, localidad, tipo }) {
    markerGroup.clearLayers()
    loadingGroup.addTo(map);
    filOrganizaciones(provincia, localidad, tipo)
        .then(data => {
            drawMarkerOrganizacion(data)
            map.removeLayer(loadingGroup);
            markerGroup.addTo(map);
        })
}

// addMarker(showAllMarker);

const addFiltros = (op) => op.reduce((acu, act) => {
    return acu += `<option value="${act}">${act}</option>`;
}, '')

const agregarPanelFiltro = (filtros) => {

    const dataFiltrada = all.filter(d => {
        return (filtros.provincia === '' || d.provincia === filtros.provincia) &&
               (filtros.localidad === '' || d.localidad === filtros.localidad) &&
               (filtros.tipo === '' || d.tipo === filtros.tipo_organizacion);
    });

    const items = dataFiltrada.reduce((acu, act) => {
        return acu += `
            <tr>
                <td><p class="mb-0 font-weight-bold" style="color: #333; font-size: 1rem;">${act.nombre_organizacion}</p></td>
                <td>
                    <button type="button" class="btn btn-info irAlLugar" data-coordinate="${[act.latitud, act.longitud]}">
                        Ir al Lugar
                    </button>
                </td>
            </tr>
        `
    }, "");

    const capitalize = str => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    const filtrosSeleccionados = Object.entries(filtros).filter(([key, value]) => !!value)

    const listFiltros = filtrosSeleccionados.reduce((acu, act) => {
        return acu += `<li class="list-group-item">${capitalize(act[0]) !== 'Tipo' ? capitalize(act[0]) : 'Tipo de Asistencia' }: ${act[1]}</li>`
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

function filtros() {

    const filtroElegida = {
        provincia: "",
        localidad: "",
        tipo: "",
    };

    const inputs = `
        <div class="container h-100 w-100 my-4">
            ${
                allOptions.provincias.length > 0 ?
                `<div class="mb-3">
                    <label for="selectProvincias" class="form-label">Por Provincia</label>
                    <select class="custom-select" id="selectProvincias">
                        <option selected class="d-none">Elije una provincia</option>
                        ${addFiltros(allOptions.provincias)}
                        <option value="not" >Sacar Filtro</option>
                    </select>
                </div>` : ''
            }
            ${
                allOptions.localidades.length > 0 ?
                `
                <div class="mb-3">
                    <label for="selectLocalidades" class="form-label">Por Localidad</label>
                    <select class="custom-select" id="selectLocalidades">
                        <option selected class="d-none">Elije una localidad</option>
                        ${addFiltros(allOptions.localidades)}
                        <option value="not" >Sacar Filtro</option>
                    </select>
                </div>
                ` : ''
            }
            ${
                allOptions.tipos.length > 0 ?
                `
                <div class="mb-3">
                    <label for="selectAsistencia" class="form-label">Por Tipo de Asistencia</label>
                    <select class="custom-select" id="selectAsistencia">
                        <option selected class="d-none">Elije un tipo</option>
                        ${addFiltros(allOptions.tipos)}
                        <option value="not" >Sacar Filtro</option>
                    </select>
                </div>
                ` : ''
            }
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

    const panelContent = {
        id: 'panelContent',
        tab: '<i class="fa fa-search"></i>',
        pane: inputs,
        title: 'Aplicar filtros',
        position: 'top',
    };
    
    sidebar.removePanel('panelLoading');
    sidebar.addPanel(panelContent);

    if (allOptions.provincias.length > 0) document.querySelector("#selectProvincias").addEventListener("change", function (e) {
        filtroElegida.provincia = e.target.value = e.target.value === 'not' ? null : e.target.value;
        addMarkerFilter(filtroElegida)
    });

    if (allOptions.localidades.length > 0) document.querySelector("#selectLocalidades").addEventListener("change", function (e) {
        filtroElegida.localidad = e.target.value = e.target.value === 'not' ? null : e.target.value;
        addMarkerFilter(filtroElegida)
    });

    if (allOptions.tipos.length > 0) document.querySelector("#selectAsistencia").addEventListener("change", function (e) {
        filtroElegida.tipo = e.target.value = e.target.value === 'not' ? null : e.target.value;
        addMarkerFilter(filtroElegida)
    });

    document.querySelector("#verSegunFiltro").addEventListener("click", e => {
        if (filtroElegida) {
            sidebar.removePanel("panelFiltro");
            agregarPanelFiltro(filtroElegida);
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


