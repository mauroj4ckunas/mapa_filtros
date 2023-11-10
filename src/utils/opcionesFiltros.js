

const entorno = 'http://localhost:3000';

export const opcionesFiltros = () => {
    const url = `${entorno}/opciones-filtros`;
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
            console.log('Datos recibidos:', data);
        })
        .catch(error => {
            console.error('Error al realizar la solicitud:', error);
        });
};
