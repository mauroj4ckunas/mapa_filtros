import { provincias } from "./utils/filtroProv.js";
import { localidades } from "./utils/filtroLocalidad.js";
import { asistencias } from "./utils/filtroAsistencia.js";
import { data } from "./utils/mock.js";

const allFiltros = {
    provincia: provincias,
    localidad: localidades,
    tipo: asistencias,
}

const map = L.map('map', {zoomControl: false});
const setMap = () => {
    map.setView([-34.5559, -64.0166], 5);
    const urlBaseLayer = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
    L.tileLayer(urlBaseLayer).addTo(map);
    map.attributionControl.setPrefix('Leaflet | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors');

    let zoomHome = L.Control.zoomHome();
    zoomHome.addTo(map);

}

setMap();

let sidebar = L.control.sidebar({
    autopan: false,       
    closeButton: true,    
    container: 'sidebar', 
    position: 'left',     
}).addTo(map);

const showAllMarker = null;
const markerGroup = L.layerGroup();

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
                            <h5 class="card-title"><i class="fa fa-building"></i> ${d.data.nombre}</h5>
                            <p class="card-text"><i class="fa fa-user"></i> Contacto: ${d.data.contacto}</p>
                            <p class="card-text"><i class="fa fa-phone"></i> Número: ${d.data.num_contacto ? d.data.num_contacto : 'Sin número del contacto'}</p>
                            <p class="card-text"><i class="fa fa-envelope"></i> Mail: ${d.data.mail ? d.data.mail : 'Sin mail del contacto'}</p>
                        </div>
                    </div>
                </div>
            `);
            marker.on('click', function () {
                const latLng = marker.getLatLng();
                const zoomLevel = 15;
                map.flyTo(latLng, zoomLevel);
            });
            markerGroup.addLayer(marker)
        }
    })
    markerGroup.addTo(map);
}

addMarker(showAllMarker);

const filtroProvincias = () => provincias.reduce((acu, act) => {
    return acu += `<option value="${act.clave}">${act.info}</option>`;
}, '')

const filtroLocalidades = () => localidades.reduce((acu, act) => {
    return acu += `<option value="${act.clave}">${act.info}</option>`;
}, '')

const filtroAsistencia = () => asistencias.reduce((acu, act) => {
    return acu += `<option value="${act.clave}">${act.info}</option>`;
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
                    map.setView(coordinates, 15);
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
