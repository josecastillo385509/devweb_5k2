// Variables de entorno para TODAS las pruebas (jest "setupFiles"; se ejecuta antes de cargar la app).
// Las pruebas usan SQLite en memoria en lugar de MySQL y no necesitan MongoDB ni un archivo .env.
process.env.NODE_ENV = 'test';
process.env.DB_DIALECT = 'sqlite';
process.env.DB_STORAGE = ':memory:';
process.env.JWT_SECRET = 'test-secret-only-for-jest';
process.env.JWT_EXPIRES_IN = '15m';
process.env.JWT_ISSUER = 'stride-co';
process.env.JWT_AUDIENCE = 'stride-co-api';
process.env.BCRYPT_SALT_ROUNDS = '4';
// consultar la BD en cada solicitud: los cambios de permisos se reflejan de inmediato
process.env.RBAC_CACHE_TTL_SECONDS = '0';
