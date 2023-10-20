
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

function onMapClick(e) {
    console.log( e.latlng);
}

map.on('click', onMapClick);

const userGroup = L.layerGroup();

function addMarkerUser() {
    const mark1 = L.marker([-34.7407, -59.6422]);
    userGroup.addLayer(mark1);
    const mark2 = L.marker([-33.6502, -61.9383]);
    userGroup.addLayer(mark2);
    const mark3 = L.marker([-32.5826, -65.6950]);
    userGroup.addLayer(mark3);
    const mark4 = L.marker([-37.3851, -64.7718]);
    userGroup.addLayer(mark4);
}

addMarkerUser();
userGroup.addTo(map);