// Resolvers de propiedad para los permisos con alcance "own".
//
// Cada resolver recibe `req` y devuelve el id del USUARIO dueño del recurso, leído de la base de datos.
// Nunca se confía en un dato enviado por el cliente para decidir quién es el dueño.
// El middleware `authorize` compara ese id contra req.user.id (usuario autenticado).
//
// Relaciones reales del proyecto:
//   Order.customerId -> Customer._id (MongoDB)    Customer.userID -> User.id (MySQL)
//   => dueño de una orden = Customer.userID de su cliente
const createError = require('http-errors');
const mongoose = require('mongoose');
const { Customer, Order } = require('../models/documents');

// Dueño de un cliente a partir de su _id. Lanza 400 si el id no es válido o no existe.
async function ownerOfCustomerId(customerId) {
  if (!mongoose.isValidObjectId(customerId)) throw createError(400, 'customerId must be a valid ObjectId');
  const customer = await Customer.findById(customerId);
  if (!customer) throw createError(400, 'customerId does not match any customer');
  return customer.userID;
}

// GET/PUT/DELETE /orders/:id  ->  dueño de la orden
async function orderOwner(req) {
  const order = await Order.findById(req.params.id).populate('customerId');
  if (!order) return undefined;
  return order.customerId ? order.customerId.userID : null;
}

// PUT /orders/:id -> además de ser dueño de la orden, no puede reasignarla al cliente de otro usuario.
async function orderOwnerOnUpdate(req) {
  const current = await orderOwner(req);
  if (current === undefined || String(current) !== String(req.user.id)) return current;

  if (req.body && req.body.customerId !== undefined) {
    const target = await ownerOfCustomerId(req.body.customerId);
    if (String(target) !== String(req.user.id)) return target;
  }
  return current;
}

// POST /orders -> la orden se crea para un cliente (body.customerId) que debe ser del usuario autenticado.
// El dueño se obtiene de la BD a partir de ese cliente.
async function orderOwnerOnCreate(req) {
  return ownerOfCustomerId(req.body && req.body.customerId);
}

// GET/PUT/DELETE /customers/:id  ->  dueño del cliente
async function customerOwner(req) {
  const customer = await Customer.findById(req.params.id);
  return customer ? customer.userID : undefined;
}

// PUT /customers/:id -> no se puede reasignar el cliente a otro usuario.
async function customerOwnerOnUpdate(req) {
  const current = await customerOwner(req);
  if (current === undefined || String(current) !== String(req.user.id)) return current;

  if (req.body && req.body.userID !== undefined && String(req.body.userID) !== String(current)) {
    return req.body.userID; // otro usuario -> el middleware responde 403
  }
  return current;
}

// POST /customers -> el cliente debe quedar a nombre del usuario autenticado (body.userID).
async function customerOwnerOnCreate(req) {
  return req.body && req.body.userID !== undefined ? req.body.userID : null;
}

// GET/PUT /users/:id -> el "dueño" de un usuario es él mismo.
async function userOwner(req) {
  return req.params.id;
}

module.exports = {
  orderOwner,
  orderOwnerOnUpdate,
  orderOwnerOnCreate,
  customerOwner,
  customerOwnerOnUpdate,
  customerOwnerOnCreate,
  userOwner,
};
