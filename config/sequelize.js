const { Sequelize } = require('sequelize');
const config = require('config');

const mysqlConfig = config.get("mysql");

// Conexión a MySQL
const sequelize = new Sequelize(
    // Nombre de la base de datos
    mysqlConfig.database,
    // Usuario de la base de datos:
    mysqlConfig.user,
    // Password
    mysqlConfig.password,
    {
        // host: Define la dirección del servidor de la base de datos
        host: mysqlConfig.host,
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

console.log("app conectada a " + mysqlConfig.database)

module.exports = sequelize;