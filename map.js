
const map = L.map('map');

const setMap = () => {
    map.setView([-34.5559, -64.0166], 5);

    const urlBaseLayer = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

    L.tileLayer(urlBaseLayer).addTo(map);
    map.attributionControl.setPrefix('Leaflet | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors');
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

const provincias = [
    { nombre: 'Buenos Aires', clave: 'buenos_aires' },
    { nombre: 'CABA', clave: 'caba' },
    { nombre: 'Catamarca', clave: 'catamarca' },
    { nombre: 'Chaco', clave: 'chaco' },
    { nombre: 'Chubut', clave: 'chubut' },
    { nombre: 'Córdoba', clave: 'cordoba' },
    { nombre: 'Corrientes', clave: 'corrientes' },
    { nombre: 'Entre Ríos', clave: 'entre_rios' },
    { nombre: 'Formosa', clave: 'formosa' },
    { nombre: 'Jujuy', clave: 'jujuy' },
    { nombre: 'La Pampa', clave: 'la_pampa' },
    { nombre: 'La Rioja', clave: 'la_rioja' },
    { nombre: 'Mendoza', clave: 'mendoza' },
    { nombre: 'Misiones', clave: 'misiones' },
    { nombre: 'Neuquén', clave: 'neuquen' },
    { nombre: 'Río Negro', clave: 'rio_negro' },
    { nombre: 'Salta', clave: 'salta' },
    { nombre: 'San Juan', clave: 'san_juan' },
    { nombre: 'San Luis', clave: 'san_luis' },
    { nombre: 'Santa Cruz', clave: 'santa_cruz' },
    { nombre: 'Santa Fe', clave: 'santa_fe' },
    { nombre: 'Santiago del Estero', clave: 'santiago_del_estero' },
    { nombre: 'Tierra del Fuego', clave: 'tierra_del_fuego' },
    { nombre: 'Tucumán', clave: 'tucuman' }
];

const dataProv = [
    {
        coordinate: [-34.74317133345502, -58.38993950186129],
        provincia: 'buenos_aires',
        title: 'Proyecto Mas',
        description: 'Descripcion del Proyecto Max'
    },
    {
        coordinate: [-29.14662871017508, -59.63440941489629],
        provincia: 'santa_fe',
        title: 'LOS CORTADEÑOS',
        description: 'Descripcion del LOS CORTADEÑOS'
    },
    {
        coordinate: [-27.473908430391607, -59.01214432071524],
        provincia: 'chaco',
        title: 'CORAZÓN AMIGO',
        description: 'Descripcion del CORAZÓN AMIGO'
    },
    {
        coordinate: [-23.812945916463313, -64.79712449468718],
        provincia: 'jujuy',
        title: 'CENTRO LIBERTAD',
        description: 'Descripcion del CENTRO LIBERTAD'
    },
    {
        coordinate: [-24.707747650774493, -60.58868413449087],
        provincia: 'Formosa',
        title: 'ASOCIACIÓN PARA LA PROMOCIÓN DE LA CULTURA Y EL DESARROLLO',
        description: 'Descripcion del ASOCIACIÓN PARA LA PROMOCIÓN DE LA CULTURA Y EL DESARROLLO'
    },
    {
        coordinate: [-31.54069031461898, -68.52747512168037],
        provincia: 'san_juan',
        title: 'Refugio Madre Teresa de Calculta',
        description: 'Descripcion del Refugio Madre Teresa de Calculta'
    },
    {
        coordinate: [-38.96534906483482, -68.06152514521344],
        provincia: 'neuquen',
        title: 'Refugio Cura Brochero',
        description: 'Descripcion del Refugio Cura Brochero'
    },
];


const markerGroup = L.layerGroup();
function addMarker(key, value) {
    markerGroup.clearLayers();
    dataProv.forEach(prov => {
        if (key === 'all' || key === prov[value]) {
            const marker = L.marker(prov.coordinate).bindPopup(`
                <div class="container">
                    <p class="font-weight-bold mb-2">${prov.title}</p>
                    <p class="font-italic">${prov.description}</p>
                </div>
            `);
            markerGroup.addLayer(marker)
        }
    })
    markerGroup.addTo(map);    
}

addMarker('all');
function filtros(sidebar, provincias) {

    let opcionesProv = '';

    provincias.forEach(p => {
        opcionesProv += `
            <option value="${p.clave}">${p.nombre}</option>
        `
    });

    const inputs = `
        <div class="container h-100 w-100 my-4">
            <div class="mb-3">
                <label for="selectProvincias" class="form-label">Por provincia</label>
                <select class="custom-select" id="selectProvincias">
                    <option selected>Elije una provincia</option>
                    ${opcionesProv}
                </select>
            </div>
            <div class="mb-3">
                <label for="selectProvincias2" class="form-label">Provincias 2</label>
                <select class="custom-select" id="selectProvincias2">
                    <option selected>Elije una provincia</option>
                    ${opcionesProv}
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
        id: 'userinfo',                     // UID, used to access the panel
        tab: '<i class="fa fa-search"></i>',  // content can be passed as HTML string,
        pane: inputs,      // DOM elements can be passed, too
        title: 'Aplicar filtros',              // an optional pane header
        position: 'top'                  // optional vertical alignment, defaults to 'top'
    };

    sidebar.addPanel(panelContent);

    document.querySelector("#selectProvincias").addEventListener("change", function (e) {
        const provinciaSeleccionada = e.target.value;
        addMarker(provinciaSeleccionada, 'provincia');
    });
    document.querySelector("#reiniciarFiltro").addEventListener("click", e => location.reload());

}

filtros(sidebar, provincias);
