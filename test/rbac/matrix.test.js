// Matriz RBAC completa contra la API real: cada fila se prueba con los tres roles.
// Las expectativas están escritas a mano (misma matriz que el README) y NO se leen del seed,
// así que cualquier diferencia entre la BD y la matriz documentada hace fallar la prueba.
const request = require('supertest');

jest.mock('../../models/documents', () => require('../helpers/fake-documents'));

const app = require('../../app');
const { Customer, Order, resetDocuments } = require('../helpers/fake-documents');
const { resetDatabase, bearer, Role, Permission, User } = require('../helpers/rbac-db');

let ctx;

beforeEach(async () => {
  resetDocuments();
  const users = await resetDatabase();

  // registros desechables para poder ejecutar DELETE sin romper otras filas
  const spareRole = await Role.create({ name: 'spare', description: 'spare' });
  const sparePermission = await Permission.create({ key: 'spare:read:any', description: 'spare' });
  const spareUser = await User.create({
    first_name: 'Spare', last_name: 'User', email: 'spare@stride.co',
    role_id: spareRole.id, password_hash: 'x', salt_key: 'x',
  });

  // cada rol tiene su propio cliente y su propia orden (dueño = ese usuario)
  const own = {};
  for (const role of ['admin', 'sales', 'user']) {
    const customer = await Customer.create({ userID: users[role].id, email: `${role}@stride.co` });
    const order = await Order.create({ customerId: customer._id, totals: { total: 100 } });
    own[role] = { customer, order };
  }
  ctx = { users, own, spareRole, sparePermission, spareUser };
});

// [nombre, método, ruta(ctx, rol), body(ctx, rol), admin, sales, user]   true = permitido, false = 403
const E = (name, method, path, body, admin, sales, user) => ({ name, method, path, body, expected: { admin, sales, user } });
const same = (value) => () => value;

const matrix = [
  // Products / Variants (mock): lectura para todos, escritura solo admin
  ...['products', 'variants'].flatMap((r) => [
    E(`${r} create any`, 'post', same(`/api/${r}`), same({ name: 'x' }), true, false, false),
    E(`${r} read any (list)`, 'get', same(`/api/${r}`), null, true, true, true),
    E(`${r} read any (one)`, 'get', same(`/api/${r}/5`), null, true, true, true),
    E(`${r} update any`, 'put', same(`/api/${r}/5`), same({ name: 'x' }), true, false, false),
    E(`${r} delete any`, 'delete', same(`/api/${r}/5`), null, true, false, false),
  ]),
  // Inventory: admin todo, sales consulta y actualiza
  E('inventory create any', 'post', same('/api/inventory'), same({ qty: 1 }), true, false, false),
  E('inventory read any (list)', 'get', same('/api/inventory'), null, true, true, false),
  E('inventory read any (one)', 'get', same('/api/inventory/5'), null, true, true, false),
  E('inventory update any', 'put', same('/api/inventory/5'), same({ qty: 2 }), true, true, false),
  E('inventory delete any', 'delete', same('/api/inventory/5'), null, true, false, false),
  // Customers (Mongo): user solo opera sobre su propio cliente
  E('customers create own/any', 'post', same('/api/customers'), (c, r) => ({ userID: c.users[r].id, email: 'n@x.co' }), true, true, true),
  E('customers read any (list)', 'get', same('/api/customers'), null, true, true, false),
  E('customers read own (mine)', 'get', same('/api/customers/mine'), null, true, true, true),
  E('customers read own/any (one)', 'get', (c, r) => `/api/customers/${c.own[r].customer._id}`, null, true, true, true),
  E('customers update own/any', 'put', (c, r) => `/api/customers/${c.own[r].customer._id}`, same({ phone: '1' }), true, true, true),
  E('customers delete any', 'delete', (c, r) => `/api/customers/${c.own[r].customer._id}`, null, true, false, false),
  // Orders (Mongo)
  E('orders create own/any', 'post', same('/api/orders'), (c, r) => ({ customerId: c.own[r].customer._id, totals: { total: 5 } }), true, true, true),
  E('orders read any (list)', 'get', same('/api/orders'), null, true, true, false),
  E('orders read own (mine)', 'get', same('/api/orders/mine'), null, true, true, true),
  E('orders read own/any (one)', 'get', (c, r) => `/api/orders/${c.own[r].order._id}`, null, true, true, true),
  E('orders update own/any', 'put', (c, r) => `/api/orders/${c.own[r].order._id}`, same({ totals: { total: 7 } }), true, true, true),
  E('orders delete any', 'delete', (c, r) => `/api/orders/${c.own[r].order._id}`, null, true, false, false),
  // Users: any solo admin; own para todos (sobre su propio registro)
  E('users create any', 'post', same('/api/users'), same({ name: 'N', lastName: 'U', email: 'new@stride.co', roleId: 3, password: 'abc12345' }), true, false, false),
  E('users read any (list)', 'get', same('/api/users'), null, true, false, false),
  E('users read own (self)', 'get', (c, r) => `/api/users/${c.users[r].id}`, null, true, true, true),
  E('users read any (someone else)', 'get', (c) => `/api/users/${c.spareUser.id}`, null, true, false, false),
  E('users update own (self)', 'put', (c, r) => `/api/users/${c.users[r].id}`, same({ name: 'Edited' }), true, true, true),
  E('users update any (someone else)', 'put', (c) => `/api/users/${c.spareUser.id}`, same({ name: 'Edited' }), true, false, false),
  E('users delete any', 'delete', (c) => `/api/users/${c.spareUser.id}`, null, true, false, false),
  // Roles / Permissions: solo admin
  ...[['roles', 'spareRole', { name: 'tmp', description: 'tmp' }], ['permissions', 'sparePermission', { key: 'tmp:read:any', description: 'tmp' }]].flatMap(([r, spare, body]) => [
    E(`${r} create any`, 'post', same(`/api/${r}`), same(body), true, false, false),
    E(`${r} read any (list)`, 'get', same(`/api/${r}`), null, true, false, false),
    E(`${r} read any (one)`, 'get', (c) => `/api/${r}/${c[spare].id}`, null, true, false, false),
    E(`${r} update any`, 'put', (c) => `/api/${r}/${c[spare].id}`, same({ description: 'changed' }), true, false, false),
    E(`${r} delete any`, 'delete', (c) => `/api/${r}/${c[spare].id}`, null, true, false, false),
  ]),
];

describe('Matriz RBAC (rol x endpoint)', () => {
  for (const role of ['admin', 'sales', 'user']) {
    describe(`rol ${role.toUpperCase()}`, () => {
      test.each(matrix.map((row) => [row.name, row]))('%s', async (_name, row) => {
        let req = request(app)[row.method](row.path(ctx, role)).set(bearer(ctx.users[role]));
        if (row.body) req = req.send(row.body(ctx, role));
        const res = await req;

        if (row.expected[role]) {
          expect([401, 403]).not.toContain(res.status);
          expect(res.status).toBeLessThan(400); // permitido y ejecutado
        } else {
          expect(res.status).toBe(403);
          expect(res.body).toEqual({ message: 'Forbidden' });
        }
      });
    });
  }
});
