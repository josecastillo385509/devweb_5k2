const { Sequelize } = require('sequelize');

// Conexión a MySQL / PostgreSQL.
// Todos los valores se pueden sobreescribir con variables de entorno (.env o docker compose);
// los valores por defecto corresponden a la configuración local original del proyecto.
// DB_DIALECT=sqlite solo se usa en las pruebas automatizadas (base en memoria).
const dialect = process.env.DB_DIALECT || 'mysql';

const options = {
    dialect,
    logging: false,
    define: {
        // Nos permite definir si queremos agregar automaticamente a nuestros modelos las propiedades de Camel Case a Snake Case:
        // createdAt -> created_at, roleId -> role_id
        underscored: true
    }
};

if (dialect === 'sqlite') {
    options.storage = process.env.DB_STORAGE || ':memory:';
} else {
    // host: Define la dirección del servidor de la base de datos
    options.host = process.env.DB_HOST || 'localhost';
    // port: El puerto en el que atiende nuestro servidor de base de datos
    options.port = Number(process.env.DB_PORT) || 3306;

    if (dialect === 'postgres') {
        options.dialectOptions = {
            ssl: { require: true, rejectUnauthorized: false }
        };
    }
}

const sequelize = new Sequelize(
    // Nombre de la base de datos
    process.env.DB_NAME || 'stride-co',
    // Usuario de la base de datos
    process.env.DB_USER || 'root',
    // Password
    process.env.DB_PASSWORD || 'abcd1234',
    options
);

module.exports = sequelize;