// Configura el entorno para las pruebas de Jest.
// NODE_ENV=test hace que config/ cargue config/test.json (incluye sqlite :memory:,
// jwt.secret de prueba, bcrypt saltRounds=4 y rbac.cacheTtlSeconds=0).
// Solo se necesita fijar NODE_ENV antes de que el módulo config se inicialice.
process.env.NODE_ENV = 'test';
