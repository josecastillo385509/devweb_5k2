// Carga la matriz RBAC en la base de datos (idempotente: se puede ejecutar varias veces).
//   roles  +  permissions  +  role_permissions
const { sequelize, User, Role, Permission } = require('../../models/relationals');
const { hashPassword } = require('../../utils/password');
const { roles, permissions, rolePermissions, demoUsers } = require('./rbac-matrix');

// Role, Permission y Role_Permission. Deja en role_permissions exactamente lo que dice la matriz.
async function seedRbac() {
  const roleByName = {};
  for (const data of roles) {
    const [role] = await Role.findOrCreate({ where: { name: data.name }, defaults: data });
    await role.update({ description: data.description });
    roleByName[data.name] = role;
  }

  const permissionByKey = {};
  for (const data of permissions) {
    const [permission] = await Permission.findOrCreate({ where: { key: data.key }, defaults: data });
    await permission.update({ description: data.description });
    permissionByKey[data.key] = permission;
  }

  for (const [roleName, keys] of Object.entries(rolePermissions)) {
    const missing = keys.filter((key) => !permissionByKey[key]);
    if (missing.length) throw new Error(`La matriz usa permisos inexistentes: ${missing.join(', ')}`);
    // setPermissions reemplaza las filas de role_permissions de ese rol
    await roleByName[roleName].setPermissions(keys.map((key) => permissionByKey[key]));
  }

  return { roles: roleByName, permissions: permissionByKey };
}

// Usuarios de demostración, uno por rol (más un segundo usuario "user" para probar el alcance own).
async function seedDemoUsers(password) {
  const created = {};
  for (const data of demoUsers) {
    const role = await Role.findOne({ where: { name: data.role } });
    let user = await User.findOne({ where: { email: data.email } });
    if (!user) {
      const { securePassword, saltKey } = await hashPassword(password);
      user = await User.create({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        role_id: role.id,
        password_hash: securePassword,
        salt_key: saltKey,
      });
    } else if (user.role_id !== role.id) {
      await user.update({ role_id: role.id });
    }
    created[data.email] = user;
  }
  return created;
}

module.exports = { seedRbac, seedDemoUsers, sequelize };
