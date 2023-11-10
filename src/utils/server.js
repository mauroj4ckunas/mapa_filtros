const express = require('express');
const cors = require('cors');

const { Organizacion, obtenerProvinciasUnicas, obtenerLocalidadesUnicas, obtenerTiposUnicos } = require('../../back/organizacion-model');


const app = express();
app.use(cors());

app.get('/opciones-filtros', async (req, res) => {
  const provincias = await obtenerProvinciasUnicas();
  const localidades = await obtenerLocalidadesUnicas();
  const tipos = await obtenerTiposUnicos();

  res.json({ provincias, localidades, tipos });
});

app.get('/filtrar', async (req, res) => {
  const { provincia, localidad, tipoOrganizacion } = req.query;

  // Construye la consulta basada en los parámetros seleccionados
  const consulta = {
    where: {},
  };

  if (provincia) {
    consulta.where.provincia = provincia;
  }

  if (localidad) {
    consulta.where.localidad = localidad;
  }

  if (tipoOrganizacion) {
    consulta.where.tipo_organizacion = tipoOrganizacion;
  }


  const resultados = await Organizacion.findAll(consulta);

  res.json(resultados);
});



app.listen(3000, () => {
  console.log('El servidor está funcionando en el puerto 3000.');
});