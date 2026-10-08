const { Sequelize } = require('sequelize');

// Conexión a MySQL
const sequelize = new Sequelize(
    // Nombre de la base de datos
    'stride-co',
    // Usuario de la base de datos:
    'root',
    // Password
    'abcd1234',
    {
        // host: Define la dirección del servidor de la base de datos
        host: 'localhost',
        // port: El puerto en el que atiende nuestro servidor de base de datos
        port: 3306,
        dialect: 'mysql',
        logging: false,
        define: {
            // Nos permite definir si queremos agregar automaticamente a nuestros modelos las propiedades de Camel Case a Snake Case:
            // createdAt -> created_at, roleId -> role_id
            underscored: true
        }
    }
);

module.exports = sequelize;