


export const opcionesFiltros = () => {
    const url = `http://localhost:3000/opciones-filtros`;
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
