const { describeCrud } = require('./helpers/crud-suite');
const { User } = require('./helpers/rbac-db');

describeCrud('users', {
  // usuario existente sobre el que se prueban GET /:id, PUT y DELETE
  seed: async (users) => {
    const spare = await User.create({
      first_name: 'Spare', last_name: 'User', email: 'spare@stride.co',
      role_id: users.user.role_id, password_hash: 'x', salt_key: 'x',
    });
    return String(spare.id);
  },
  createBody: (users) => ({
    name: 'Nuevo', lastName: 'Usuario', email: 'nuevo@stride.co', roleId: users.user.role_id, password: 'abc12345',
  }),
});
