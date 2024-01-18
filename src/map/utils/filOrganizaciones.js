

export const filOrganizaciones = (provincia = "", localidad = "", tipo_organizacion = "") => {
    const url = `http://191.101.71.110:3000/filtrar?provincia=${provincia}&localidad=${localidad}&tipoOrganizacion=${tipo_organizacion}`;
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
