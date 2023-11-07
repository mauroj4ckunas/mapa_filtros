const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize-config'); // Importa la configuración de Sequelize

const Organizacion = sequelize.define('Organizacion', {
  // Define los campos de tu modelo aquí
  provincia: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  localidad: {
    type: DataTypes.STRING,
    allowNull:false,
  },
  nombre_organizacion: {
    type: DataTypes.STRING,
    allowNull:false
  },
  tipo_organizacion: {
    type: DataTypes.STRING,
    allowNull:false
  },
  direccion: {
    type: DataTypes.STRING,
    allowNull:false
  },
  latitud: {
    type: DataTypes.DECIMAL(16,14),
    allowNull:false
  },
  longitud: {
    type: DataTypes.DECIMAL(16,14),
    allowNull:false
  },
  nro_contacto: {
    type: DataTypes.STRING,
    allowNull:false
  },
  email: {
    type: DataTypes.STRING,
    allowNull:false
  },
  redes: {
    type: DataTypes.STRING,
    allowNull:false
  },
  asistencia_alojamiento: {
    type: DataTypes.BOOLEAN,
    allowNull:false
  },
  asistencia_higiene: {
    type: DataTypes.BOOLEAN,
    allowNull:false
  },
  asistencia_salud: {
    type: DataTypes.BOOLEAN,
    allowNull:false
  },
  asistencia_alimentacion: {
    type: DataTypes.BOOLEAN,
    allowNull:false
  },
  asistencia_recreacion: {
    type: DataTypes.BOOLEAN,
    allowNull:false
  },
  asistencia_recorridas: {
    type: DataTypes.BOOLEAN,
    allowNull:false
  },
  genero_mujeres_cis: {
    type: DataTypes.BOOLEAN,
    allowNull:false
  },
  genero_varones_cis: {
    type: DataTypes.BOOLEAN,
    allowNull:false
  },
  genero_lbgtiq: {
    type: DataTypes.BOOLEAN,
    allowNull:false
  },
  edades: {
    type: DataTypes.STRING,
    allowNull:false
  },
  dias_horarios: {
    type: DataTypes.STRING,
    allowNull:false
  },
  info_adicional: {
    type: DataTypes.STRING,
    allowNull:false
  },
    },{      
      getterMethods:{
        coordinates(){
          return [this.getDataValue('latitud'), this.getDataValue('longitud')];
        }
    },
    toJSON:{
      getters:true,
    },
    tableName:"organizaciones",
  });


  // ...

const obtenerProvinciasUnicas = async () => {
  const provincias = await Organizacion.findAll({
    attributes: [[sequelize.fn('DISTINCT', sequelize.col('provincia')), 'provincia']],
  });
  return provincias.map((org) => org.dataValues.provincia);
};

const obtenerLocalidadesUnicas = async () => {
  const localidades = await Organizacion.findAll({
    attributes: [[sequelize.fn('DISTINCT', sequelize.col('localidad')), 'localidad']],
  });
  return localidades.map((org) => org.dataValues.localidad);
};

const obtenerTiposUnicos = async () => {
  const tipos = await Organizacion.findAll({
    attributes: [[sequelize.fn('DISTINCT', sequelize.col('tipo_organizacion')), 'tipo_organizacion']],
  });
  return tipos.map((org) => org.dataValues.tipo_organizacion);
};



// Sincroniza el modelo con la base de datos (crea la tabla si no existe)
(async () => {
  await Organizacion.sync();
})();

module.exports = {
  Organizacion,
  obtenerProvinciasUnicas,
  obtenerLocalidadesUnicas,
  obtenerTiposUnicos,
};