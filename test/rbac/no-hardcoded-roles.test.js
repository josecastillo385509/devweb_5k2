// Verificación estática de las restricciones de la Tarea 6 (sección 7.1):
// la autorización no se resuelve con validaciones por nombre de rol ni dentro de los controllers.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', '..');
const read = (dir) =>
  fs.readdirSync(path.join(root, dir)).filter((f) => f.endsWith('.js'))
    .map((f) => ({ file: `${dir}/${f}`, source: fs.readFileSync(path.join(root, dir, f), 'utf8') }));

describe('Sin roles ni permisos hardcodeados', () => {
  const sources = [...read('routes'), ...read('controllers'), ...read('api'), ...read('rbac')];

  test.each(sources.map((s) => [s.file, s.source]))('%s no compara nombres de rol', (_file, source) => {
    expect(source).not.toMatch(/role(\.name|Name)?\s*[!=]==?\s*['"`]/i);
    expect(source).not.toMatch(/['"`](admin|sales)['"`]\s*[!=]==?/);
    expect(source).not.toMatch(/\[\s*['"`](admin|sales)['"`][^\]]*\]\s*\.includes\(/);
  });

  test.each(read('controllers').map((s) => [s.file, s.source]))('%s no contiene lógica de autorización', (_file, source) => {
    expect(source).not.toMatch(/403|Forbidden|authorize|AccessControl|req\.rbac/);
  });

  test('todas las rutas de recursos pasan por authenticate y authorize', () => {
    const resources = ['products', 'variants', 'inventory', 'customers', 'orders', 'users', 'roles', 'permissions'];
    for (const name of resources) {
      const source = fs.readFileSync(path.join(root, 'routes', `${name}.js`), 'utf8');
      expect(source).toMatch(/router\.use\(authenticate\)/);
      const handlers = source.match(/router\.(get|post|put|delete)\(/g) || [];
      const guarded = source.match(/router\.(get|post|put|delete)\([^;]*?authorize\(/gs) || [];
      expect(handlers.length).toBeGreaterThanOrEqual(5);
      expect(guarded).toHaveLength(handlers.length);
    }
  });
});
