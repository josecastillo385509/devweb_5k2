const { hashPassword, verifyPassword } = require('../utils/password');

describe('Utils: Password hashing & verification', () => {
  test('hashPassword debe generar un hash y un salt válidos', async () => {
    const rawPassword = 'MiPasswordSeguro123!';
    const { securePassword, saltKey } = await hashPassword(rawPassword);

    expect(typeof securePassword).toBe('string');
    expect(typeof saltKey).toBe('string');
    expect(securePassword).not.toBe(rawPassword);
    expect(securePassword.length).toBeGreaterThan(0);
    expect(saltKey.length).toBeGreaterThan(0);
  });

  test('verifyPassword debe retornar true para la contraseña correcta', async () => {
    const rawPassword = 'MiPasswordSeguro123!';
    const { securePassword } = await hashPassword(rawPassword);

    const isValid = await verifyPassword(rawPassword, securePassword);
    expect(isValid).toBe(true);
  });

  test('verifyPassword debe retornar false para una contraseña incorrecta', async () => {
    const rawPassword = 'MiPasswordSeguro123!';
    const { securePassword } = await hashPassword(rawPassword);

    const isValid = await verifyPassword('PasswordErroneo', securePassword);
    expect(isValid).toBe(false);
  });
});
