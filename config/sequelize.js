const config = require('config');
const { Sequelize } = require('sequelize');

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
        }
    }
}

const sequelize = new Sequelize(
    config.get('database.sql.name'),
    config.get('database.sql.user'),
    config.has('database.sql.password') ? config.get('database.sql.password') : null,
    options
);

module.exports = sequelize;
