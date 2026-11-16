const fs = require('fs');
const path = require('path');
const request = require('supertest');
const app = require('../app');
const { resetDatabase, bearer } = require('./helpers/rbac-db');

describe('4.5 Internacionalización (i18n)', () => {
  let authAdmin;
  let authSales;

  beforeAll(async () => {
    const users = await resetDatabase();
    authAdmin = bearer(users.admin);
    authSales = bearer(users.sales);
  });

  describe('Archivos de idioma (locales)', () => {
    const localesDir = path.join(__dirname, '..', 'locales');
    const enFile = path.join(localesDir, 'en.json');
    const esFile = path.join(localesDir, 'es.json');

    function extractKeys(obj, prefix = '') {
      let keys = [];
      for (const [key, value] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          keys = keys.concat(extractKeys(value, fullKey));
        } else {
          keys.push(fullKey);
        }
      }
      return keys.sort();
    }

    test('existen los archivos en.json y es.json en locales/', () => {
      expect(fs.existsSync(enFile)).toBe(true);
      expect(fs.existsSync(esFile)).toBe(true);
    });

    test('ambos archivos de idioma tienen exactamente las mismas claves', () => {
      const enCatalog = JSON.parse(fs.readFileSync(enFile, 'utf8'));
      const esCatalog = JSON.parse(fs.readFileSync(esFile, 'utf8'));

      const enKeys = extractKeys(enCatalog);
      const esKeys = extractKeys(esCatalog);

      expect(enKeys).toEqual(esKeys);
    });

    test('no existen valores de traducción vacíos', () => {
      const enCatalog = JSON.parse(fs.readFileSync(enFile, 'utf8'));
      const esCatalog = JSON.parse(fs.readFileSync(esFile, 'utf8'));

      function assertNoEmpty(catalog) {
        for (const v of Object.values(catalog)) {
          if (typeof v === 'object' && v !== null) {
            assertNoEmpty(v);
          } else {
            expect(typeof v).toBe('string');
            expect(v.trim().length).toBeGreaterThan(0);
          }
        }
      }

      assertNoEmpty(enCatalog);
      assertNoEmpty(esCatalog);
    });

    test('las claves del recurso products contienen list, notFound y created (según especificación)', () => {
      const esCatalog = JSON.parse(fs.readFileSync(esFile, 'utf8'));
      expect(esCatalog.products).toHaveProperty('list', 'Productos obtenidos');
      expect(esCatalog.products).toHaveProperty('notFound', 'Producto no encontrado');
      expect(esCatalog.products).toHaveProperty('created', 'Producto creado');
    });
  });

  describe('Detección de idioma y orden de prioridad (?lang -> Header -> defecto)', () => {
    test('sin header ni query responde en el idioma por defecto (en)', async () => {
      const res = await request(app).get('/api/products').set(authAdmin);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Products retrieved');
    });

    test('Header Accept-Language: es responde en español', async () => {
      const res = await request(app)
        .get('/api/products')
        .set(authAdmin)
        .set('Accept-Language', 'es');
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Productos obtenidos');
    });

    test('Header Accept-Language: en responde en inglés', async () => {
      const res = await request(app)
        .get('/api/products')
        .set(authAdmin)
        .set('Accept-Language', 'en');
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Products retrieved');
    });

    test('variante regional en header (es-MX) se resuelve al idioma base (es)', async () => {
      const res = await request(app)
        .get('/api/products')
        .set(authAdmin)
        .set('Accept-Language', 'es-MX');
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Productos obtenidos');
    });

    test('variante regional en header (en-US) se resuelve al idioma base (en)', async () => {
      const res = await request(app)
        .get('/api/products')
        .set(authAdmin)
        .set('Accept-Language', 'en-US');
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Products retrieved');
    });

    test('query parameter ?lang=es responde en español', async () => {
      const res = await request(app)
        .get('/api/products?lang=es')
        .set(authAdmin);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Productos obtenidos');
    });

    test('variante regional en query parameter (?lang=es-MX) se resuelve a es', async () => {
      const res = await request(app)
        .get('/api/products?lang=es-MX')
        .set(authAdmin);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Productos obtenidos');
    });

    test('query parameter ?lang=es tiene prioridad sobre Header Accept-Language: en', async () => {
      const res = await request(app)
        .get('/api/products?lang=es')
        .set(authAdmin)
        .set('Accept-Language', 'en');
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Productos obtenidos');
    });

    test('query parameter ?lang=en tiene prioridad sobre Header Accept-Language: es', async () => {
      const res = await request(app)
        .get('/api/products?lang=en')
        .set(authAdmin)
        .set('Accept-Language', 'es');
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Products retrieved');
    });

    test('idioma no soportado (?lang=fr) responde en el idioma por defecto (en)', async () => {
      const res = await request(app)
        .get('/api/products?lang=fr')
        .set(authAdmin);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Products retrieved');
    });

    test('idioma no soportado (Accept-Language: fr) responde en el idioma por defecto (en)', async () => {
      const res = await request(app)
        .get('/api/products')
        .set(authAdmin)
        .set('Accept-Language', 'fr');
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Products retrieved');
    });
  });

  describe('Traducción de errores (401, 403, 404)', () => {
    test('401 sin token responde con mensaje traducido en español', async () => {
      const res = await request(app)
        .get('/api/products')
        .set('Accept-Language', 'es');
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('No autorizado');
    });

    test('401 sin token responde con mensaje en inglés por defecto', async () => {
      const res = await request(app).get('/api/products');
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Unauthorized');
    });

    test('403 sin permiso suficiente responde con mensaje traducido en español', async () => {
      const res = await request(app)
        .delete('/api/products/7')
        .set(authSales)
        .set('Accept-Language', 'es');
      expect(res.status).toBe(403);
      expect(res.body.message).toBe('Prohibido');
    });

    test('403 sin permiso suficiente responde con mensaje en inglés', async () => {
      const res = await request(app)
        .delete('/api/products/7')
        .set(authSales)
        .set('Accept-Language', 'en');
      expect(res.status).toBe(403);
      expect(res.body.message).toBe('Forbidden');
    });

    test('404 producto no encontrado responde con el ejemplo exacto del enunciado', async () => {
      // curl -H "Accept-Language: es" -H "Authorization: Bearer <token>" https://<url>/api/products/999
      // { "message": "Producto no encontrado" }
      const res = await request(app)
        .get('/api/products/999')
        .set(authAdmin)
        .set('Accept-Language', 'es');
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: 'Producto no encontrado' });
    });

    test('404 producto no encontrado responde en inglés si se solicita en', async () => {
      const res = await request(app)
        .get('/api/products/999')
        .set(authAdmin)
        .set('Accept-Language', 'en');
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: 'Product not found' });
    });

    test('404 ruta desconocida responde con mensaje traducido', async () => {
      const resEs = await request(app)
        .get('/api/ruta-desconocida')
        .set('Accept-Language', 'es');
      expect(resEs.status).toBe(404);
      expect(resEs.body.message).toBe('No encontrado');

      const resEn = await request(app)
        .get('/api/ruta-desconocida')
        .set('Accept-Language', 'en');
      expect(resEn.status).toBe(404);
      expect(resEn.body.message).toBe('Not Found');
    });
  });

  describe('Controladores traducen mediante req.__ (sin textos en el código)', () => {
    test('POST /api/products traduce message de creación', async () => {
      const resEs = await request(app)
        .post('/api/products')
        .set(authAdmin)
        .set('Accept-Language', 'es')
        .send({ name: 'Zapatos' });
      expect(resEs.status).toBe(201);
      expect(resEs.body.message).toBe('Producto creado');

      const resEn = await request(app)
        .post('/api/products')
        .set(authAdmin)
        .set('Accept-Language', 'en')
        .send({ name: 'Shoes' });
      expect(resEn.status).toBe(201);
      expect(resEn.body.message).toBe('Product created');
    });

    test('verificación estática: los controladores usan req.__ y no textos literales en message', () => {
      const controllersDir = path.join(__dirname, '..', 'controllers');
      const files = fs.readdirSync(controllersDir).filter((f) => f.endsWith('.js') && f !== 'index.js');

      for (const file of files) {
        const content = fs.readFileSync(path.join(controllersDir, file), 'utf8');
        // Debe usar req.__
        expect(content).toMatch(/req\.__\(/);
        // No debe tener message: 'texto' o message: "texto" hardcodeado
        const hardcodedMatches = content.match(/message:\s*['"`][A-Za-z]/g);
        expect(hardcodedMatches).toBeNull();
      }
    });
  });

  describe('Vistas Pug internacionalizadas', () => {
    test('GET / con Accept-Language: es renderiza el texto en español', async () => {
      const res = await request(app)
        .get('/')
        .set('Accept-Language', 'es');
      expect(res.status).toBe(200);
      expect(res.text).toContain('Bienvenido a Inicio');
      expect(res.text).toContain('lang="es"');
    });

    test('GET / con Accept-Language: en renderiza el texto en inglés', async () => {
      const res = await request(app)
        .get('/')
        .set('Accept-Language', 'en');
      expect(res.status).toBe(200);
      expect(res.text).toContain('Welcome to Home');
      expect(res.text).toContain('lang="en"');
    });

    test('GET /?lang=es renderiza el texto en español', async () => {
      const res = await request(app).get('/?lang=es');
      expect(res.status).toBe(200);
      expect(res.text).toContain('Bienvenido a Inicio');
    });
  });
});
