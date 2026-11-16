const { describeCrud } = require('./helpers/crud-suite');
const { Role } = require('./helpers/rbac-db');

describeCrud('roles', {
  seed: async () => String((await Role.create({ name: 'spare', description: 'spare' })).id),
  createBody: { name: 'nuevo-rol', description: 'rol de prueba' },
});
