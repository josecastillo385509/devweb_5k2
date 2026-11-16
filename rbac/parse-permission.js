// Convención de Permission.key:  recurso:acción:alcance   (p. ej. orders:read:own)
//
//   recurso -> products, orders, users...
//   acción  -> create | read | update | delete
//   alcance -> own | any   (possession en la terminología de AccessControl)

const ACTIONS = ['create', 'read', 'update', 'delete'];
const POSSESSIONS = ['own', 'any'];
const RESOURCE = /^[a-z][a-z0-9_-]*$/;

// Separa una key en { resource, action, possession }.
// Devuelve null si la key no respeta la convención.
function parsePermissionKey(key) {
  if (typeof key !== 'string') return null;
  const parts = key.split(':');
  if (parts.length !== 3) return null;

  const [resource, action, possession] = parts;
  if (!RESOURCE.test(resource)) return null;
  if (!ACTIONS.includes(action)) return null;
  if (!POSSESSIONS.includes(possession)) return null;

  return { resource, action, possession };
}

module.exports = { parsePermissionKey, ACTIONS, POSSESSIONS };
