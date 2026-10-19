// Middleware de autenticación.
// Procesa el header "Authorization: Bearer <token>", verifica el JWT con express-jwt
// y deja al usuario autenticado en req.user.
const { expressjwt } = require('express-jwt');
const { User } = require('../models/relationals');

// Verifica firma, expiración, issuer y audience. El payload queda en req.auth.
// Se construye por solicitud para leer las variables de entorno ya cargadas;
// si falta JWT_SECRET la solicitud falla, nunca se deja pasar sin verificar.
function verifyToken(req, res, next) {
  return expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    issuer: process.env.JWT_ISSUER,
    audience: process.env.JWT_AUDIENCE,
  })(req, res, next);
}

// Busca al usuario del token (req.auth.sub) y valida que siga existiendo y activo.
async function loadUser(req, res, next) {
  try {
    const user = await User.findByPk(req.auth.sub);
    if (!user || !user.active) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.user = user;
    return next();
  } catch (err) {
    return next(err);
  }
}

// Request -> express-jwt (Bearer Token) -> req.auth.sub -> Buscar usuario -> Validar active -> req.user -> next()
const authenticate = [verifyToken, loadUser];

module.exports = { authenticate };
