const { describeCrud } = require('./helpers/crud-suite');
const { Permission } = require('./helpers/rbac-db');

describeCrud('permissions', {
  seed: async () => String((await Permission.create({ key: 'spare:read:any', description: 'spare' })).id),
  createBody: { key: 'nuevo:read:any', description: 'permiso de prueba' },
});
