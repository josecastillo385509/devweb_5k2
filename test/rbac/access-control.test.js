// Carga de permisos desde la BD: Role -> Role_Permission -> Permission -> AccessControl
const { parsePermissionKey } = require('../../rbac/parse-permission');
const { getAccessControl, invalidateAccessControl, can, buildGrants } = require('../../rbac/access-control');
const { authorize } = require('../../api/authorize');
const { resetDatabase, Role, Permission } = require('../helpers/rbac-db');

describe('parsePermissionKey (recurso:acción:alcance)', () => {
  test('separa resource, action y possession', () => {
    expect(parsePermissionKey('orders:read:own')).toEqual({ resource: 'orders', action: 'read', possession: 'own' });
    expect(parsePermissionKey('products:delete:any')).toEqual({ resource: 'products', action: 'delete', possession: 'any' });
  });

  test.each([
    'orders', 'orders:read', 'orders:read:own:extra', 'orders:list:own', 'orders:read:all',
    ':read:any', 'Orders:read:any', 'orders.read.any', '', null, undefined, 42,
  ])('rechaza la key inválida %p', (key) => {
    expect(parsePermissionKey(key)).toBeNull();
  });
});

describe('Configuración de AccessControl construida desde la BD', () => {
  beforeEach(async () => { await resetDatabase(); });

  test('crea un rol de AccessControl por cada Role con permisos', async () => {
    const { ac } = await getAccessControl();
    expect(ac.getRoles().sort()).toEqual(['admin', 'sales', 'user']);
  });

  test('admin puede products:delete:any; sales no', async () => {
    const { ac } = await getAccessControl();
    expect(ac.can('admin').deleteAny('products').granted).toBe(true);
    expect(ac.can('sales').deleteAny('products').granted).toBe(false);
  });

  test('user tiene orders:read:own pero no orders:read:any', async () => {
    const { ac } = await getAccessControl();
    expect(ac.can('user').readOwn('orders').granted).toBe(true);
    expect(ac.can('user').readAny('orders').granted).toBe(false);
  });

  test('el permiso any implica own (sales puede orders:read:own por orders:read:any)', async () => {
    const { ac } = await getAccessControl();
    expect(ac.can('sales').readOwn('orders').granted).toBe(true);
  });

  test('can() resuelve el rol a partir de User.role_id', async () => {
    const admin = await Role.findOne({ where: { name: 'admin' } });
    const user = await Role.findOne({ where: { name: 'user' } });
    expect(await can(admin.id, 'products', 'delete', 'any')).toBe(true);
    expect(await can(user.id, 'products', 'delete', 'any')).toBe(false);
    expect(await can(user.id, 'orders', 'read', 'own')).toBe(true);
    expect(await can(99999, 'orders', 'read', 'own')).toBe(false); // rol inexistente
    expect(await can(null, 'orders', 'read', 'own')).toBe(false);
  });

  test('las keys inválidas guardadas en Permission se ignoran', async () => {
    const bad = await Permission.create({ key: 'esto-no-es-valido', description: 'x' });
    const user = await Role.findOne({ where: { name: 'user' } });
    await user.addPermission(bad);

    const roles = await Role.findAll({ include: [{ model: Permission, as: 'permissions' }] });
    const grants = buildGrants(roles);
    expect(grants.some((g) => g.resource === 'esto-no-es-valido')).toBe(false);
    expect(grants.every((g) => /^(create|read|update|delete):(own|any)$/.test(g.action))).toBe(true);
  });

  test('con TTL > 0 la configuración se conserva hasta invalidarla', async () => {
    process.env.RBAC_CACHE_TTL_SECONDS = '60';
    try {
      invalidateAccessControl();
      const first = await getAccessControl();
      expect(await getAccessControl()).toBe(first); // misma instancia (cache)
      invalidateAccessControl();
      expect(await getAccessControl()).not.toBe(first);
    } finally {
      process.env.RBAC_CACHE_TTL_SECONDS = '0';
    }
  });
});

describe('Middleware authorize', () => {
  test('sin req.user responde 401 y no ejecuta el controller', async () => {
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    await authorize('products', 'read', 'any')({}, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('con permiso llama next() y registra req.rbac', async () => {
    await resetDatabase();
    const admin = await Role.findOne({ where: { name: 'admin' } });
    const req = { user: { id: 1, role_id: admin.id } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    await authorize('products', 'delete', 'any')(req, res, next);
    expect(next).toHaveBeenCalledWith();
    expect(req.rbac).toEqual({ resource: 'products', action: 'delete', possession: 'any' });
  });

  test('un endpoint "any" no acepta un permiso solo own', async () => {
    await resetDatabase();
    const user = await Role.findOne({ where: { name: 'user' } });
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    await authorize('orders', 'read', 'any')({ user: { id: 3, role_id: user.id } }, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  test('un error de la BD llega a next(err), nunca se autoriza por omisión', async () => {
    const { sequelize } = require('../helpers/rbac-db');
    await sequelize.drop(); // simula una BD caída
    invalidateAccessControl();
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    await authorize('products', 'read', 'any')({ user: { id: 1, role_id: 1 } }, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(res.status).not.toHaveBeenCalledWith(200);
  });
});
