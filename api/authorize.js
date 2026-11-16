// Middleware de autorización RBAC.
//
// Uso:  authorize(recurso, acción, alcance, [opciones])
//
//   router.get('/', authenticate, authorize('products', 'read', 'any'), controller.list);
//   router.get('/:id', authenticate, authorize('orders', 'read', 'own', { owner: orderOwner }), controller.find);
//
// Flujo:
//   req.user (authenticate) -> role_id -> permisos leídos de la BD (AccessControl)
//     ¿tiene permiso?  no -> 403 Forbidden
//                      sí -> si el permiso es "own" se comprueba que el recurso sea del usuario
//
// Este middleware NO autentica: debe ir después de `authenticate`. Si no hay req.user responde 401.
const { can } = require('../rbac/access-control');

const FORBIDDEN = { message: 'Forbidden' };

/**
 * @param {string} resource    products, orders, users...
 * @param {string} action      create | read | update | delete
 * @param {string} possession  'any' exige el permiso :any
 *                             'own' acepta :own (con verificación de propiedad) o :any
 * @param {object} [options]
 * @param {(req) => Promise<string|number|null|undefined>} [options.owner]
 *        Obtiene (desde la BD, nunca del cliente) el id del usuario dueño del recurso.
 *        Se usa solo cuando el rol tiene únicamente el permiso :own.
 */
function authorize(resource, action, possession = 'any', options = {}) {
  return async function authorizeMiddleware(req, res, next) {
    try {
      if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

      const roleId = req.user.role_id;

      // 1) permiso :any -> puede operar sobre cualquier recurso del tipo indicado
      if (await can(roleId, resource, action, 'any')) {
        req.rbac = { resource, action, possession: 'any' };
        return next();
      }

      // 2) un endpoint 'any' no admite el permiso :own
      if (possession !== 'own') return res.status(403).json(FORBIDDEN);

      // 3) permiso :own -> solo sobre recursos propios
      if (!(await can(roleId, resource, action, 'own'))) {
        return res.status(403).json(FORBIDDEN);
      }

      if (typeof options.owner === 'function') {
        const ownerId = await options.owner(req);
        if (ownerId === undefined || ownerId === null) {
          return res.status(404).json({ message: 'Resource not found' });
        }
        if (String(ownerId) !== String(req.user.id)) {
          return res.status(403).json(FORBIDDEN);
        }
      }
      // sin `owner`: el endpoint ya está acotado al usuario autenticado (p. ej. /orders/mine)

      req.rbac = { resource, action, possession: 'own' };
      return next();
    } catch (err) {
      return next(err);
    }
  };
}

module.exports = { authorize };
