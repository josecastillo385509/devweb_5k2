// Construye la configuración de AccessControl a partir de la base de datos.
//
//   Role -> Role_Permission -> Permission  ==>  grants  ==>  AccessControl
//
// La base de datos es la ÚNICA fuente de verdad: aquí no hay roles ni permisos escritos en código.
const debug = require('debug')('stride-co:rbac');
const { AccessControl } = require('accesscontrol');
const { Role, Permission } = require('../models/relationals');
const { parsePermissionKey } = require('./parse-permission');

// Segundos que se conserva en memoria la configuración leída de la BD.
// 0 = consultar la BD en cada solicitud (siempre refleja el último cambio).
function getTtlMs() {
  const raw = process.env.RBAC_CACHE_TTL_SECONDS;
  const seconds = raw === undefined || raw === '' ? 10 : Number(raw);
  return (Number.isFinite(seconds) && seconds >= 0 ? seconds : 10) * 1000;
}

// Consulta que une las tres tablas: Role + role_permissions + Permission.
async function fetchRolesWithPermissions() {
  return Role.findAll({
    include: [{
      model: Permission,
      as: 'permissions',
      attributes: ['key'],
      through: { attributes: [] },
    }],
  });
}

// Transforma las filas de la BD en el arreglo de "grants" que entiende AccessControl:
//   { role: 'user', resource: 'orders', action: 'read:own', attributes: '*' }
function buildGrants(roles) {
  const grants = [];
  for (const role of roles) {
    for (const permission of role.permissions) {
      const parsed = parsePermissionKey(permission.key);
      if (!parsed) {
        debug('Permission.key ignorada (no cumple recurso:acción:alcance): %s', permission.key);
        continue;
      }
      grants.push({
        role: role.name,
        resource: parsed.resource,
        action: `${parsed.action}:${parsed.possession}`,
        attributes: '*',
      });
    }
  }
  return grants;
}

// Lee la BD y devuelve { ac, roleNamesById }.
async function loadAccessControl() {
  const roles = await fetchRolesWithPermissions();
  const ac = new AccessControl(buildGrants(roles));
  ac.lock();

  // User.role_id -> Role.name (AccessControl identifica a los roles por nombre)
  const roleNamesById = new Map(roles.map((role) => [String(role.id), role.name]));
  return { ac, roleNamesById };
}

let cache = null; // { promise, loadedAt }

// Devuelve la configuración vigente, recargándola de la BD cuando expira el TTL.
async function getAccessControl() {
  const ttl = getTtlMs();
  const expired = !cache || ttl === 0 || Date.now() - cache.loadedAt >= ttl;

  if (expired) {
    const entry = { loadedAt: Date.now() };
    entry.promise = loadAccessControl().catch((err) => {
      // no se conserva una carga fallida
      if (cache === entry) cache = null;
      throw err;
    });
    cache = entry;
  }
  return cache.promise;
}

// Fuerza que la siguiente solicitud vuelva a leer la BD.
function invalidateAccessControl() {
  cache = null;
}

// ¿El rol (por id) tiene el permiso recurso:acción:alcance?
// AccessControl aplica que "any" implica "own".
async function can(roleId, resource, action, possession) {
  const { ac, roleNamesById } = await getAccessControl();
  const roleName = roleNamesById.get(String(roleId));
  if (!roleName || !ac.hasRole(roleName)) return false; // sin rol o rol sin permisos

  const method = `${action}${possession === 'any' ? 'Any' : 'Own'}`;
  return ac.can(roleName)[method](resource).granted;
}

module.exports = {
  getAccessControl,
  invalidateAccessControl,
  can,
  // exportadas para pruebas
  buildGrants,
};
