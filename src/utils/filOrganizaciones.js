
const entorno = 'http://localhost:3000';

export const filOrganizaciones = (provincia = "", localidad = "", tipo_organizacion = "") => {
    const url = `${entorno}/filtrar?provincia=${provincia}&localidad=${localidad}&tipo_organizacion=${tipo_organizacion}`;
    return fetch(url, {
        'method': 'GET',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error('Error al realizar la solicitud:', error);
        });
};
