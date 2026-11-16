const config = require('config');
const path = require('path');
const i18n = require('i18n');

i18n.configure({
  locales: ['en', 'es'],
  defaultLocale: config.get('i18n.defaultLocale'),
  directory: path.join(__dirname, '..', 'locales'),
  queryParameter: 'lang',
  fallbacks: {
    'es-*': 'es',
    'es_*': 'es',
    'en-*': 'en',
    'en_*': 'en',
  },
  autoReload: false,
  updateFiles: false,
  syncFiles: false,
  objectNotation: true,
});

function i18nMiddleware(req, res, next) {
  if (req && req.headers && typeof req.headers['accept-language'] === 'string') {
    req.headers['accept-language'] = req.headers['accept-language'].toLowerCase();
  }
  return i18n.init(req, res, () => {
    if (res && res.locals) {
      res.locals.__ = (...args) => req.__ ? req.__(...args) : i18n.__(...args);
      res.locals.getLocale = () => req.getLocale ? req.getLocale() : i18n.getLocale();
    }
    return next();
  });
}

module.exports = { i18n, i18nMiddleware };
