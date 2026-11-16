// MATRIZ RBAC de Stride & Co. expresada como DATOS que se cargan a la base de datos
// (tablas roles, permissions y role_permissions) con `npm run seed`.
//
// IMPORTANTE: este archivo solo lo usa el script de seed. La API NO lo importa:
// en ejecución los permisos se leen siempre de la base de datos (ver rbac/access-control.js).
//
// Convención de Permission.key:  recurso:acción:alcance   (alcance: own | any)

const ACTION_LABEL = { create: 'Crear', read: 'Consultar', update: 'Actualizar', delete: 'Eliminar' };
const POSSESSION_LABEL = { any: 'cualquier registro de', own: 'únicamente registros propios de' };

// Catálogo de permisos (Permission)
const PERMISSION_KEYS = [
  // Catálogo (MySQL / mock)
  'products:create:any', 'products:read:any', 'products:update:any', 'products:delete:any',
  'variants:create:any', 'variants:read:any', 'variants:update:any', 'variants:delete:any',
  'inventory:create:any', 'inventory:read:any', 'inventory:update:any', 'inventory:delete:any',
  // Clientes y órdenes (MongoDB): Customer.userID -> User.id, Order.customerId -> Customer._id
  'customers:create:any', 'customers:create:own', 'customers:read:any', 'customers:read:own',
  'customers:update:any', 'customers:update:own', 'customers:delete:any',
  'orders:create:any', 'orders:create:own', 'orders:read:any', 'orders:read:own',
  'orders:update:any', 'orders:update:own', 'orders:delete:any',
  // Administración (MySQL)
  'users:create:any', 'users:read:any', 'users:read:own', 'users:update:any', 'users:update:own', 'users:delete:any',
  'roles:create:any', 'roles:read:any', 'roles:update:any', 'roles:delete:any',
  'permissions:create:any', 'permissions:read:any', 'permissions:update:any', 'permissions:delete:any',
];

const permissions = PERMISSION_KEYS.map((key) => {
  const [resource, action, possession] = key.split(':');
  return { key, description: `${ACTION_LABEL[action]} ${POSSESSION_LABEL[possession]} ${resource}` };
});

// Catálogo de roles (Role)
const roles = [
  { name: 'admin', description: 'Administrador: control total del sistema' },
  { name: 'sales', description: 'Ventas: atiende clientes, órdenes e inventario' },
  { name: 'user', description: 'Usuario: opera únicamente sobre sus propios datos' },
];

// Asignación Role -> Permission (tabla role_permissions)
// Nota: en AccessControl el permiso :any implica :own, por eso admin y sales no repiten los :own.
const rolePermissions = {
  admin: PERMISSION_KEYS.filter((key) => key.endsWith(':any')),
  sales: [
    'products:read:any',
    'variants:read:any',
    'inventory:read:any', 'inventory:update:any',
    'customers:create:any', 'customers:read:any', 'customers:update:any',
    'orders:create:any', 'orders:read:any', 'orders:update:any',
    'users:read:own', 'users:update:own',
  ],
  user: [
    'products:read:any',
    'variants:read:any',
    'customers:create:own', 'customers:read:own', 'customers:update:own',
    'orders:create:own', 'orders:read:own', 'orders:update:own',
    'users:read:own', 'users:update:own',
  ],
};

// Usuarios de demostración (solo para probar la matriz; la contraseña viene de SEED_PASSWORD)
const demoUsers = [
  { first_name: 'Ana', last_name: 'Admin', email: 'admin@stride.co', role: 'admin' },
  { first_name: 'Sergio', last_name: 'Sales', email: 'sales@stride.co', role: 'sales' },
  { first_name: 'Ursula', last_name: 'User', email: 'user@stride.co', role: 'user' },
  { first_name: 'Ulises', last_name: 'Other', email: 'user2@stride.co', role: 'user' },
];

module.exports = { roles, permissions, rolePermissions, demoUsers };
