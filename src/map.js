import { provincias, localidades, data } from "./mock.js";

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

const markerGroup = L.layerGroup();
function addMarker(key, value) {
    markerGroup.clearLayers();
    data.forEach(d => {
        if (key === 'all' || key === d[value]) {
            const marker = L.marker(d.coordinate).bindPopup(`
                <div class="container">
                    <p class="font-weight-bold mb-2">${d.title}</p>
                    <p class="font-italic">${d.description}</p>
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

addMarker('all');

const filtroProvincias = () => provincias.reduce((acu, act) => {
    return acu += `<option value="${act.nombre}">${act.nombre}</option>`;
}, '')

const filtroLocalidades = () => localidades.reduce((acu, act) => {
    return acu += `<option value="${act.nombre}">${act.nombre}</option>`;
}, '')

const agregarPanelFiltro = (sidebar, opcion, filtro) => {

    const dataFiltrada = data.filter(d => d[filtro] === opcion.nombre);
    const items = dataFiltrada.reduce((acu, act) => {
        return acu += `
            <tr>
                <td>${act.title}</td>
                <td>${act.provincia}</td>
                <td>${act.localidad}</td>
            </tr>
        `
    }, "");

    const list = `
        <div class="container my-4">
            <table class="table table-striped">
                <thead class="thead-dark">
                <tr>
                    <th scope="col">Nombre</th>
                    <th scope="col">Provincia</th>
                    <th scope="col">Localidad</th>
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
        title: `Ubicaciones según: ${opcion.nombre}`,
        position: 'top',
    };

    sidebar.addPanel(panelFiltro);
}

function filtros(sidebar) {

    let opcionElegida = '';
    let filtroElegida = '';

    const inputs = `
        <div class="container h-100 w-100 my-4">
            <div class="mb-3">
                <label for="selectProvincias" class="form-label">Por Provincia</label>
                <select class="custom-select" id="selectProvincias">
                    <option selected>Elije una provincia</option>
                    ${filtroProvincias()}
                </select>
            </div>
            <div class="mb-3">
                <label for="selectLocalidades" class="form-label">Por Localidad</label>
                <select class="custom-select" id="selectLocalidades">
                    <option selected>Elije una localidad</option>
                    ${filtroLocalidades()}
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
        const seleccionada = e.target.value;
        opcionElegida = provincias.find(p => p.nombre === seleccionada);
        filtroElegida = 'provincia';
        addMarker(seleccionada, 'provincia');
    });

    document.querySelector("#selectLocalidades").addEventListener("change", function (e) {
        const seleccionada = e.target.value;
        opcionElegida = localidades.find(l => l.nombre === seleccionada);
        filtroElegida = 'localidad';
        addMarker(seleccionada, 'localidad');
    });

    document.querySelector("#recargarFiltro").addEventListener("click", e => location.reload());

    document.querySelector("#verSegunFiltro").addEventListener("click", e => {
        if (opcionElegida && filtroElegida) {
            sidebar.removePanel("panelFiltro");
            agregarPanelFiltro(sidebar, opcionElegida, filtroElegida);
        } else {
            alert("Debe seleccionar un filtro primero")
        }
    });

}

filtros(sidebar);
