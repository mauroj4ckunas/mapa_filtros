const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize-config'); 
const bcrypt = require('bcrypt'); 

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre_usuario: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    set(value) {
      
      const hashedPassword = bcrypt.hashSync(value, bcrypt.genSaltSync(10));
      this.setDataValue('password', hashedPassword);
    },
  },
}, {
  tableName: 'usuarios',
});


Usuario.prototype.validarPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

Usuario.prototype.crearUser = async (user) => await Usuario.create(user);

// Sincroniza el modelo con la base de datos (crea la tabla si no existe)
(async () => {
    await Usuario.sync();
  })();
  

module.exports = {Usuario};
