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
    autopan: false,       // whether to maintain the centered map point when opening the sidebar
    closeButton: true,    // whether t add a close button to the panes
    container: 'sidebar', // the DOM container or #ID of a predefined sidebar container that should be used
    position: 'left',     // left or right
}).addTo(map);

document.querySelectorAll('.leaflet-sidebar-close').forEach(closeButton => {
    closeButton.addEventListener('click', () => {
        sidebar.close();
    });
});

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
    return acu += `<option value="${act.clave}">${act.nombre}</option>`;
}, '')

const filtroLocalidades = () => localidades.reduce((acu, act) => {
    return acu += `<option value="${act.clave}">${act.nombre}</option>`;
}, '')

function filtros(sidebar) {

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
            <div class="row mt-10">
                <div class="col-md-12">
                    <button type="button" class="btn btn-info float-right" id="reiniciarFiltro">
                        Reiniciar filtros
                    </button>
                </div>
            </div>
        </div>
    `;

    let panelContent = {
        id: 'userinfo',
        tab: '<i class="fa fa-search"></i>',
        pane: inputs,
        title: 'Aplicar filtros',
        position: 'top',
    };

    sidebar.addPanel(panelContent);

    document.querySelector("#selectProvincias").addEventListener("change", function (e) {
        const seleccionada = e.target.value;
        addMarker(seleccionada, 'provincia');
    });

    document.querySelector("#selectLocalidades").addEventListener("change", function (e) {
        const seleccionada = e.target.value;
        addMarker(seleccionada, 'localidad');
    });

    document.querySelector("#reiniciarFiltro").addEventListener("click", e => location.reload());

}

filtros(sidebar);
