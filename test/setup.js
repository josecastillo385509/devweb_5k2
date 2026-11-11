// Configuración del entorno de pruebas
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret_key_12345';
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
process.env.JWT_ISSUER = process.env.JWT_ISSUER || 'stride-co';
process.env.JWT_AUDIENCE = process.env.JWT_AUDIENCE || 'stride-co-api';
process.env.BCRYPT_SALT_ROUNDS = process.env.BCRYPT_SALT_ROUNDS || '4';

const User = require('../models/relationals/User');
const Role = require('../models/relationals/Role');
const Permission = require('../models/relationals/Permission');
const { Customer, Order } = require('../models/documents');

// Mocks por defecto para modelos relacionales (Sequelize)
function createMockUser(overrides = {}) {
  const instance = {
    id: 1,
    first_name: 'Test',
    last_name: 'User',
    email: 'test@example.com',
    role_id: 1,
    active: true,
    password_hash: '$2b$04$z9v8Kx5vW517D9eY5lKqDeYkL0Q4q0oV6X5Y3xQ4Z0y5R4B9q0K5q',
    salt_key: '$2b$04$z9v8Kx5vW517D9eY5lKqDe',
    role: { id: 1, name: 'Admin' },
    update: jest.fn().mockImplementation(async function (changes) {
      Object.assign(this, changes);
      return this;
    }),
    destroy: jest.fn().mockResolvedValue(true),
    get: function () {
      return { ...this };
    },
    toJSON: function () {
      const copy = { ...this };
      delete copy.password_hash;
      delete copy.salt_key;
      delete copy.update;
      delete copy.destroy;
      delete copy.get;
      delete copy.toJSON;
      return copy;
    },
    ...overrides,
  };
  return instance;
}

function createMockRole(overrides = {}) {
  return {
    id: 1,
    name: 'Admin',
    description: 'Administrator role',
    permissions: [],
    setPermissions: jest.fn().mockResolvedValue(true),
    update: jest.fn().mockImplementation(async function (changes) {
      Object.assign(this, changes);
      return this;
    }),
    destroy: jest.fn().mockResolvedValue(true),
    ...overrides,
  };
}

function createMockPermission(overrides = {}) {
  return {
    id: 1,
    key: 'manage_users',
    description: 'Permission to manage users',
    update: jest.fn().mockImplementation(async function (changes) {
      Object.assign(this, changes);
      return this;
    }),
    destroy: jest.fn().mockResolvedValue(true),
    ...overrides,
  };
}

function createMockCustomer(overrides = {}) {
  return {
    _id: '507f1f77bcf86cd799439011',
    userID: 1,
    phone: '555-1234',
    email: 'customer@example.com',
    addresses: [],
    ...overrides,
  };
}

function createMockOrder(overrides = {}) {
  return {
    _id: '507f191e810c19729de860ea',
    customerId: '507f1f77bcf86cd799439011',
    totals: { subtotal: 100, shipping: 10, discount: 0, total: 110 },
    ...overrides,
  };
}

// Reset de mocks antes de cada prueba
beforeEach(() => {
  // User mocks
  User.create = jest.fn().mockImplementation(async (data) => createMockUser(data));
  User.findAll = jest.fn().mockResolvedValue([createMockUser()]);
  User.findByPk = jest.fn().mockImplementation(async (id) => (id ? createMockUser({ id: Number(id) || 1 }) : null));
  User.findOne = jest.fn().mockImplementation(async ({ where } = {}) => {
    if (where && where.email) {
      return createMockUser({ email: where.email });
    }
    return createMockUser();
  });

  // Role mocks
  Role.create = jest.fn().mockImplementation(async (data) => createMockRole(data));
  Role.findAll = jest.fn().mockResolvedValue([createMockRole()]);
  Role.findByPk = jest.fn().mockImplementation(async (id) => (id ? createMockRole({ id: Number(id) || 1 }) : null));

  // Permission mocks
  Permission.create = jest.fn().mockImplementation(async (data) => createMockPermission(data));
  Permission.findAll = jest.fn().mockResolvedValue([createMockPermission()]);
  Permission.findByPk = jest.fn().mockImplementation(async (id) => (id ? createMockPermission({ id: Number(id) || 1 }) : null));

  // Customer mocks
  Customer.create = jest.fn().mockImplementation(async (data) => createMockCustomer(data));
  Customer.find = jest.fn().mockResolvedValue([createMockCustomer()]);
  Customer.findById = jest.fn().mockImplementation(async (id) => (id ? createMockCustomer({ _id: String(id) }) : null));
  Customer.findByIdAndUpdate = jest.fn().mockImplementation(async (id, body) => (id ? createMockCustomer({ _id: String(id), ...body }) : null));
  Customer.findByIdAndDelete = jest.fn().mockImplementation(async (id) => (id ? createMockCustomer({ _id: String(id) }) : null));

  // Order mocks
  Order.create = jest.fn().mockImplementation(async (data) => createMockOrder(data));
  const mockOrderQuery = {
    populate: jest.fn().mockResolvedValue([createMockOrder()]),
    then: function (resolve, reject) {
      return Promise.resolve([createMockOrder()]).then(resolve, reject);
    },
  };
  Order.find = jest.fn().mockReturnValue(mockOrderQuery);
  Order.findById = jest.fn().mockImplementation(async (id) => (id ? createMockOrder({ _id: String(id) }) : null));
});

module.exports = {
  createMockUser,
  createMockRole,
  createMockPermission,
  createMockCustomer,
  createMockOrder,
};
