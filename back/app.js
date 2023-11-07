const Organizacion = require('./organizacion-model');

(async () => {
  try {
    const registros = await Organizacion.findAll();
    console.log('Registros recuperados:');
    registros.forEach(registro => {
      console.log(registro.coordinates)
    });
  } catch (error) {
    console.error('Error al recuperar registros:', error);
  }
})();
