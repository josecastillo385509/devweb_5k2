// Escenarios mínimos de la Tarea 6 (sección 11) y casos adicionales de own / any.
const request = require('supertest');

jest.mock('../../models/documents', () => require('../helpers/fake-documents'));

const app = require('../../app');
const { Customer, Order, resetDocuments } = require('../helpers/fake-documents');
const { resetDatabase, bearer, tokenFor, Role, Permission } = require('../helpers/rbac-db');

let users;        // { admin, sales, user, other }
let userOrder;    // orden del usuario "user"
let otherOrder;   // orden del usuario "other" (otro usuario con el mismo rol)
let userCustomer;
let otherCustomer;

beforeEach(async () => {
  resetDocuments();
  users = await resetDatabase();
  userCustomer = await Customer.create({ userID: users.user.id, email: 'user@stride.co' });
  otherCustomer = await Customer.create({ userID: users.other.id, email: 'user2@stride.co' });
  userOrder = await Order.create({ customerId: userCustomer._id, totals: { total: 100 } });
  otherOrder = await Order.create({ customerId: otherCustomer._id, totals: { total: 200 } });
});

describe('11.1 Acceso permitido', () => {
  test('ADMIN con products:delete:any elimina cualquier producto', async () => {
    const res = await request(app).delete('/api/products/7').set(bearer(users.admin));
    expect(res.status).toBe(200);
  });
});

describe('11.2 Acceso denegado', () => {
  test('SALES sin products:delete:any recibe 403 Forbidden', async () => {
    const res = await request(app).delete('/api/products/7').set(bearer(users.sales));
    expect(res.status).toBe(403);
    expect(res.body).toEqual({ message: 'Forbidden' });
  });
});

describe('11.3 Recurso propio (own)', () => {
  test('USER con orders:read:own consulta su propia orden', async () => {
    const res = await request(app).get(`/api/orders/${userOrder._id}`).set(bearer(users.user));
    expect(res.status).toBe(200);
    expect(res.body.data._id).toBe(userOrder._id);
  });

  test('USER con orders:update:own actualiza su propia orden', async () => {
    const res = await request(app)
      .put(`/api/orders/${userOrder._id}`).set(bearer(users.user)).send({ totals: { total: 150 } });
    expect(res.status).toBe(200);
  });

  test('GET /orders/mine solo devuelve las órdenes del usuario autenticado', async () => {
    const res = await request(app).get('/api/orders/mine').set(bearer(users.user));
    expect(res.status).toBe(200);
    expect(res.body.data.map((o) => o._id)).toEqual([userOrder._id]);
  });
});

describe('11.4 Recurso de otro usuario', () => {
  test('USER con orders:read:own recibe 403 al consultar la orden de otro usuario', async () => {
    const res = await request(app).get(`/api/orders/${otherOrder._id}`).set(bearer(users.user));
    expect(res.status).toBe(403);
    expect(res.body).toEqual({ message: 'Forbidden' });
  });

  test('USER no puede actualizar la orden de otro usuario', async () => {
    const res = await request(app)
      .put(`/api/orders/${otherOrder._id}`).set(bearer(users.user)).send({ totals: { total: 1 } });
    expect(res.status).toBe(403);
    expect(Order._docs.find((o) => o._id === otherOrder._id).totals.total).toBe(200); // sin cambios
  });

  test('USER no puede reasignar su orden al cliente de otro usuario', async () => {
    const res = await request(app)
      .put(`/api/orders/${userOrder._id}`).set(bearer(users.user)).send({ customerId: otherCustomer._id });
    expect(res.status).toBe(403);
    expect(Order._docs.find((o) => o._id === userOrder._id).customerId).toBe(userCustomer._id);
  });

  test('USER no puede crear una orden para el cliente de otro usuario', async () => {
    const res = await request(app)
      .post('/api/orders').set(bearer(users.user)).send({ customerId: otherCustomer._id });
    expect(res.status).toBe(403);
    expect(Order._docs).toHaveLength(2);
  });

  test('USER no puede consultar ni editar el cliente de otro usuario', async () => {
    const get = await request(app).get(`/api/customers/${otherCustomer._id}`).set(bearer(users.user));
    const put = await request(app).put(`/api/customers/${otherCustomer._id}`).set(bearer(users.user)).send({ phone: '1' });
    expect(get.status).toBe(403);
    expect(put.status).toBe(403);
  });

  test('USER no puede crear un cliente a nombre de otro usuario', async () => {
    const res = await request(app)
      .post('/api/customers').set(bearer(users.user)).send({ userID: users.other.id });
    expect(res.status).toBe(403);
  });

  test('USER no puede ver ni editar el perfil de otro usuario', async () => {
    const get = await request(app).get(`/api/users/${users.other.id}`).set(bearer(users.user));
    const put = await request(app).put(`/api/users/${users.other.id}`).set(bearer(users.user)).send({ name: 'X' });
    expect(get.status).toBe(403);
    expect(put.status).toBe(403);
  });
});

describe('11.5 Permiso any no asignado', () => {
  test('USER sin orders:read:any recibe 403 al listar todas las órdenes', async () => {
    const res = await request(app).get('/api/orders').set(bearer(users.user));
    expect(res.status).toBe(403);
  });

  test('USER sin orders:delete:any no puede eliminar ni su propia orden', async () => {
    const res = await request(app).delete(`/api/orders/${userOrder._id}`).set(bearer(users.user));
    expect(res.status).toBe(403);
  });
});

describe('Permiso any: opera sobre recursos de cualquier usuario', () => {
  test('SALES con orders:read:any consulta la orden de cualquier usuario', async () => {
    const res = await request(app).get(`/api/orders/${otherOrder._id}`).set(bearer(users.sales));
    expect(res.status).toBe(200);
  });

  test('SALES con orders:read:any lista todas las órdenes', async () => {
    const res = await request(app).get('/api/orders').set(bearer(users.sales));
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
  });

  test('ADMIN con orders:delete:any elimina la orden de otro usuario', async () => {
    const res = await request(app).delete(`/api/orders/${otherOrder._id}`).set(bearer(users.admin));
    expect(res.status).toBe(200);
    expect(Order._docs.find((o) => o._id === otherOrder._id)).toBeUndefined();
  });
});

describe('Validaciones de la solicitud con own', () => {
  test('orden inexistente con permiso own responde 404', async () => {
    const res = await request(app).get(`/api/orders/${'f'.repeat(24)}`).set(bearer(users.user));
    expect(res.status).toBe(404);
  });

  test('crear orden sin customerId responde 400', async () => {
    const res = await request(app).post('/api/orders').set(bearer(users.user)).send({});
    expect(res.status).toBe(400);
  });

  test('id con formato inválido responde 400 (después de autenticar y autorizar)', async () => {
    const res = await request(app).get('/api/orders/5').set(bearer(users.user));
    expect(res.status).toBe(400);
  });
});

describe('401 Unauthorized vs 403 Forbidden', () => {
  test('sin token -> 401 (lo resuelve la autenticación, no RBAC)', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(401);
  });

  test('token inválido -> 401', async () => {
    const res = await request(app).get('/api/products').set({ Authorization: 'Bearer abc.def.ghi' });
    expect(res.status).toBe(401);
  });

  test('usuario autenticado sin permiso -> 403', async () => {
    const res = await request(app).get('/api/users').set(bearer(users.user));
    expect(res.status).toBe(403);
  });

  test('el cliente no puede elevar privilegios enviando un rol o un userID propio en el body', async () => {
    const res = await request(app)
      .get(`/api/orders/${otherOrder._id}`).set(bearer(users.user))
      .set('X-Role', 'admin').send({ role: 'admin', userID: users.other.id });
    expect(res.status).toBe(403);
  });
});

describe('Usuarios sin rol utilizable', () => {
  test('rol sin permisos asignados -> 403', async () => {
    const empty = await Role.create({ name: 'empty', description: 'sin permisos' });
    await users.user.update({ role_id: empty.id });
    const res = await request(app).get('/api/products').set(bearer(users.user));
    expect(res.status).toBe(403);
  });

  test('usuario sin role_id -> 403', async () => {
    await users.user.update({ role_id: null });
    const res = await request(app).get('/api/products').set(bearer(users.user));
    expect(res.status).toBe(403);
  });
});

describe('La base de datos es la fuente de verdad', () => {
  test('asignar un permiso en role_permissions lo habilita sin tocar el código', async () => {
    const before = await request(app).delete('/api/products/7').set(bearer(users.sales));
    expect(before.status).toBe(403);

    const sales = await Role.findOne({ where: { name: 'sales' } });
    const permission = await Permission.findOne({ where: { key: 'products:delete:any' } });
    await sales.addPermission(permission);

    const after = await request(app).delete('/api/products/7').set(bearer(users.sales));
    expect(after.status).toBe(200);
  });

  test('quitar un permiso en role_permissions lo revoca', async () => {
    const sales = await Role.findOne({ where: { name: 'sales' } });
    const permission = await Permission.findOne({ where: { key: 'products:read:any' } });
    await sales.removePermission(permission);

    const res = await request(app).get('/api/products').set(bearer(users.sales));
    expect(res.status).toBe(403);
  });

  test('un rol nuevo creado solo en la BD se aplica sin tocar el código', async () => {
    const before = await request(app).get('/api/orders').set(bearer(users.user));
    expect(before.status).toBe(403);

    const auditor = await Role.create({ name: 'auditor', description: 'solo lectura de órdenes' });
    const readAny = await Permission.findOne({ where: { key: 'orders:read:any' } });
    await auditor.addPermission(readAny);
    await users.user.update({ role_id: auditor.id });

    const list = await request(app).get('/api/orders').set(bearer(users.user));
    const remove = await request(app).delete(`/api/orders/${userOrder._id}`).set(bearer(users.user));
    expect(list.status).toBe(200);
    expect(remove.status).toBe(403);
  });

  test('un endpoint "any" no se habilita con un permiso own (orders:delete:own no basta)', async () => {
    const permission = await Permission.create({ key: 'orders:delete:own', description: 'nuevo' });
    const role = await Role.findOne({ where: { name: 'user' } });
    await role.addPermission(permission);

    const res = await request(app).delete(`/api/orders/${userOrder._id}`).set(bearer(users.user));
    expect(res.status).toBe(403);
  });

  test('token de un usuario eliminado -> 401', async () => {
    const token = tokenFor(users.other);
    await users.other.destroy();
    const res = await request(app).get('/api/products').set({ Authorization: `Bearer ${token}` });
    expect(res.status).toBe(401);
  });
});
