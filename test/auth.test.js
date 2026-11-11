const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
const User = require('../models/relationals/User');
const { hashPassword } = require('../utils/password');
const { createMockUser } = require('./setup');

describe('Auth API (/api/auth)', () => {
  const userPassword = 'TestPassword123!';
  let validUser;
  let validToken;

  beforeEach(async () => {
    const { securePassword, saltKey } = await hashPassword(userPassword);
    validUser = createMockUser({
      id: 1,
      first_name: 'Auth',
      last_name: 'Tester',
      email: 'auth@stride.co',
      active: true,
      password_hash: securePassword,
      salt_key: saltKey,
    });

    User.findOne = jest.fn().mockImplementation(async ({ where } = {}) => {
      if (where && where.email === 'auth@stride.co') {
        return validUser;
      }
      return null;
    });

    User.findByPk = jest.fn().mockImplementation(async (id) => {
      if (Number(id) === validUser.id) {
        return validUser;
      }
      return null;
    });

    validToken = jwt.sign(
      { sub: String(validUser.id) },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
        issuer: process.env.JWT_ISSUER,
        audience: process.env.JWT_AUDIENCE,
        algorithm: 'HS256',
      }
    );
  });

  describe('POST /api/auth/login', () => {
    test('debe responder 200 y entregar token con credenciales válidas', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'auth@stride.co', password: userPassword });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Login successful');
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.tokenType).toBe('Bearer');
      expect(res.body.data.expiresIn).toBe(process.env.JWT_EXPIRES_IN);

      // Verificar que el token generado sea decodificable
      const decoded = jwt.verify(res.body.data.token, process.env.JWT_SECRET, {
        issuer: process.env.JWT_ISSUER,
        audience: process.env.JWT_AUDIENCE,
      });
      expect(decoded.sub).toBe(String(validUser.id));
    });

    test('debe responder 400 si falta el email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ password: userPassword });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('email and password are required');
    });

    test('debe responder 400 si falta el password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'auth@stride.co' });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('email and password are required');
    });

    test('debe responder 400 si email o password no son strings', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 12345, password: ['abc'] });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('email and password are required');
    });

    test('debe responder 401 si el usuario no existe', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nonexistent@stride.co', password: userPassword });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('message');
    });

    test('debe responder 401 si el usuario existe pero está inactivo', async () => {
      validUser.active = false;

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'auth@stride.co', password: userPassword });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('message');
    });

    test('debe responder 401 si la contraseña es incorrecta', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'auth@stride.co', password: 'WrongPassword!' });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('GET /api/auth/me', () => {
    test('debe responder 200 con el perfil del usuario autenticado', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('email', 'auth@stride.co');
      expect(res.body).toHaveProperty('first_name', 'Auth');
      expect(res.body).toHaveProperty('last_name', 'Tester');
      // No debe exponer contraseñas ni salts
      expect(res.body).not.toHaveProperty('password_hash');
      expect(res.body).not.toHaveProperty('salt_key');
    });

    test('debe responder 401 si no se envía header Authorization', async () => {
      const res = await request(app).get('/api/auth/me');

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Unauthorized');
    });

    test('debe responder 401 con token inválido', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer token_invalido_123');

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Unauthorized');
    });

    test('debe responder 401 si el token expiró', async () => {
      const expiredToken = jwt.sign(
        { sub: String(validUser.id) },
        process.env.JWT_SECRET,
        {
          expiresIn: '0s',
          issuer: process.env.JWT_ISSUER,
          audience: process.env.JWT_AUDIENCE,
          algorithm: 'HS256',
        }
      );

      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Unauthorized');
    });

    test('debe responder 401 si el usuario del token ya no está activo', async () => {
      validUser.active = false;

      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Unauthorized');
    });
  });
});
