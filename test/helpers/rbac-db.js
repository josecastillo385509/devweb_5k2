// Utilidades de pruebas: base de datos SQLite con la MISMA matriz RBAC que carga `npm run seed`,
// usuarios de demostración y tokens JWT reales (firmados igual que controllers/auth.js).
const jwt = require('jsonwebtoken');
const { sequelize, User, Role, Permission } = require('../../models/relationals');
const { seedRbac, seedDemoUsers } = require('../../db/seeds/rbac');
const { invalidateAccessControl } = require('../../rbac/access-control');

const PASSWORD = 'Passw0rd!';

// Recrea las tablas, carga la matriz y los usuarios. Devuelve los usuarios por rol.
async function resetDatabase() {
  await sequelize.sync({ force: true });
  invalidateAccessControl();
  await seedRbac();
  const users = await seedDemoUsers(PASSWORD);
  return {
    admin: users['admin@stride.co'],
    sales: users['sales@stride.co'],
    user: users['user@stride.co'],
    other: users['user2@stride.co'], // segundo usuario con rol "user"
  };
}

function tokenFor(user) {
  return jwt.sign({ sub: String(user.id) }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
    issuer: process.env.JWT_ISSUER,
    audience: process.env.JWT_AUDIENCE,
    algorithm: 'HS256',
  });
}

const bearer = (user) => ({ Authorization: `Bearer ${tokenFor(user)}` });

module.exports = { sequelize, User, Role, Permission, PASSWORD, resetDatabase, tokenFor, bearer };
