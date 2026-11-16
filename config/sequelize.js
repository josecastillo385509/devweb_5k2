const config = require('config');
const { Sequelize } = require('sequelize');
const config = require('config');

const mysqlConfig = config.get("mysql");

feat/automatized-jest-supertest
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

const dialect = config.get('database.sql.dialect');

const options = {
    dialect,
    logging: false,
    define: {
        // createdAt -> created_at, roleId -> role_id
        underscored: true
    }
};

if (dialect === 'sqlite') {
    options.storage = config.get('database.sql.storage');
} else {
    options.host = config.get('database.sql.host');
    options.port = config.get('database.sql.port');

    if (dialect === 'postgres') {
        const ssl = config.has('database.sql.ssl') ? config.get('database.sql.ssl') : null;
        if (ssl) {
            options.dialectOptions = { ssl };
 main
        }
    }
}

const sequelize = new Sequelize(
    config.get('database.sql.name'),
    config.get('database.sql.user'),
    config.has('database.sql.password') ? config.get('database.sql.password') : null,
    options
);

feat/automatized-jest-supertest
if (process.env.NODE_ENV !== 'test') {
    console.log("app conectada a " + mysqlConfig.database);
}

module.exports = sequelize;

module.exports = sequelize;
main
