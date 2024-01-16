const express = require('express');
const cors = require('cors');

const { Organizacion, obtenerProvinciasUnicas, obtenerLocalidadesUnicas, obtenerTiposUnicos } = require('../../back/organizacion-model');
const {Usuario} = require('../../back/usuario-model');
const bcrypt = require('bcrypt');



const app = express();
app.use(express.json()); 
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


  const resultados = await Organizacion.validadas(consulta.where);

  res.json(resultados);
});

app.get('/organizaciones/validadas', async (req, res) => {
  try {
    const organizacionesValidadas = await Organizacion.validadas({});
    res.json(organizacionesValidadas);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
});

app.get('/organizaciones/no-validadas', async (req, res) => {
  try {
    const organizacionesNoValidadas = await Organizacion.noValidadas();
    res.json(organizacionesNoValidadas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/organizaciones', async (req, res) => {
  const nuevaOrganizacionDatos = req.body; // Se espera que los datos estén en el body de la solicitud
  console.log(nuevaOrganizacionDatos)
  try {
    const nuevaOrganizacion = await Organizacion.crearOrganizacion(nuevaOrganizacionDatos);
    res.status(201).json(nuevaOrganizacion);
  } catch (error) {
    console.log(nuevaOrganizacionDatos)
    res.status(500).json({ error: error.message });
  }
});

app.put('/organizaciones/:id/editar', async (req, res) => {
  const { id } = req.params; // Obtiene el ID de la URL
  const nuevaOrganizacion = req.body; // Se espera que los datos estén en el body de la solicitud
  try {
    const editOrganizacion = await Organizacion.editarOrganizacion(id, nuevaOrganizacion);
    res.status(201).json({ message: 'El formulario fue editado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/organizaciones/:id/validar', async (req, res) => {
  const { id } = req.params; // Obtiene el ID de la URL
  try {
    const organizacion = await Organizacion.findByPk(id);
    
    if (!organizacion) {
      return res.status(404).json({ error: 'Organización no encontrada' });
    }

    organizacion.validada = true; // Cambia el estado de validada a true
    await organizacion.save(); // Guarda los cambios en la base de datos

    res.status(200).json({ message: 'Estado de validación actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/login', async (req, res) => {
  const { nombre_usuario, password } = req.body;

  try {    
    const usuarioEncontrado = await Usuario.findOne({ where: { nombre_usuario } });

    if (!usuarioEncontrado) {
      return res.status(404).json({ error: 'Nombre de usuario no encontrado' });
    }

    const contraseñaValida = bcrypt.compareSync(password, usuarioEncontrado.password);

    if (!!contraseñaValida) {     
      const { id, nombre_usuario } = usuarioEncontrado.toJSON();
      return res.json({ id, nombre_usuario });
    } else {
      return res.status(401).json({ error: 'Credenciales incorrecta' });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post('/login/create', async (req, res) => {
  const { nombre_usuario, password } = req.body;
  try {    
    const usuarioEncontrado = await Usuario.findOne({ where: { nombre_usuario } });

    if (usuarioEncontrado) {
      return res.status(404).json({ error: 'Usuario no disponible' });
    }

    const nuevoUser = await Usuario.prototype.crearUser({ "nombre_usuario": nombre_usuario, "password": password });
    return res.status(201).json({'id': nuevoUser.id, 'usuario': nuevoUser.nombre_usuario});
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});



app.listen(3000, () => {
  console.log('El servidor está funcionando en el puerto 3000.');
});