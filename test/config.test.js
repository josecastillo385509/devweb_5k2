const fs = require('fs');
const path = require('path');
const config = require('config');

describe('4.6 Configuración por entornos y secretos', () => {
  const rootDir = path.resolve(__dirname, '..');

  test('dotenv no está presente en package.json ni en node_modules como dependencia directa', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
    expect(pkg.dependencies.dotenv).toBeUndefined();
    expect(pkg.devDependencies?.dotenv).toBeUndefined();
    expect(pkg.dependencies.config).toBeDefined();
  });

  test('.env.example fue eliminado del proyecto', () => {
    expect(fs.existsSync(path.join(rootDir, '.env.example'))).toBe(false);
  });

  test('las plantillas local-development.example.json y local-production.example.json existen', () => {
    const devExamplePath = path.join(rootDir, 'config', 'local-development.example.json');
    const prodExamplePath = path.join(rootDir, 'config', 'local-production.example.json');
    expect(fs.existsSync(devExamplePath)).toBe(true);
    expect(fs.existsSync(prodExamplePath)).toBe(true);

    const devExample = JSON.parse(fs.readFileSync(devExamplePath, 'utf8'));
    expect(devExample.jwt).toBeDefined();
    expect(devExample.jwt.secret).toBeDefined();
  });

  test('.gitignore y .dockerignore excluyen config/local*.json pero permiten *.example.json', () => {
    const gitignore = fs.readFileSync(path.join(rootDir, '.gitignore'), 'utf8');
    const dockerignore = fs.readFileSync(path.join(rootDir, '.dockerignore'), 'utf8');

    for (const content of [gitignore, dockerignore]) {
      expect(content).toMatch(/config\/local\*\.json/);
      expect(content).toMatch(/!config\/local\*\.example\.json/);
    }
  });

  test('custom-environment-variables.json mapea PORT a server.port', () => {
    const customEnvPath = path.join(rootDir, 'config', 'custom-environment-variables.json');
    expect(fs.existsSync(customEnvPath)).toBe(true);
    const customEnv = JSON.parse(fs.readFileSync(customEnvPath, 'utf8'));
    expect(customEnv.server.port.__name).toBe('PORT');
  });

  test('default.json contiene las configuraciones no secretas', () => {
    const defaultJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'config', 'default.json'), 'utf8'));
    expect(defaultJson.server.port).toBe(3000);
    expect(defaultJson.jwt.issuer).toBe('stride-co');
    expect(defaultJson.jwt.algorithm).toBe('HS256');
    expect(defaultJson.bcrypt.saltRounds).toBe(10);
    expect(defaultJson.rbac.cacheTtlSeconds).toBe(10);
    expect(defaultJson.i18n.defaultLocale).toBe('en');
    expect(defaultJson.jwt.secret).toBeUndefined();
  });

  test('production.json configura dialecto postgres y ssl', () => {
    const prodJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'config', 'production.json'), 'utf8'));
    expect(prodJson.database.sql.dialect).toBe('postgres');
    expect(prodJson.database.sql.ssl.require).toBe(true);
    expect(prodJson.database.sql.password).toBeUndefined();
  });

  test('test.json permite ejecutar pruebas sin secretos reales', () => {
    expect(config.get('jwt.secret')).toBe('test-secret-only-for-jest');
    expect(config.get('database.sql.dialect')).toBe('sqlite');
    expect(config.get('server.port')).toBe(3000);
  });
});
