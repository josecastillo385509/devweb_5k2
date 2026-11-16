const express = require('express');
const { validateObjectId } = require('../api/validate-id');
const controller = require('../controllers/orders');
const { authenticate } = require('../api/authenticate');
const { authorize } = require('../api/authorize');
const { orderOwner, orderOwnerOnUpdate, orderOwnerOnCreate } = require('../api/ownership');

const router = express.Router();

// Autenticación (401) y después autorización RBAC (403) en cada endpoint
router.use(authenticate);

// Las órdenes viven en MongoDB: el :id es un ObjectId
router.param('id', validateObjectId);

/* POST orders - crear (orders:create:any, o :own si el cliente de la orden pertenece al usuario) */
router.post('/', authorize('orders', 'create', 'own', { owner: orderOwnerOnCreate }), controller.create);

/* GET orders - listar todas (orders:read:any) */
router.get('/', authorize('orders', 'read', 'any'), controller.list);

/* GET orders/mine - órdenes del usuario autenticado (orders:read:own) */
router.get('/mine', authorize('orders', 'read', 'own'), controller.mine);

/* GET orders/:id - obtener una (orders:read:own con verificación de propiedad) */
router.get('/:id', authorize('orders', 'read', 'own', { owner: orderOwner }), controller.find);

/* PUT orders/:id - actualizar (orders:update:own con verificación de propiedad) */
router.put('/:id', authorize('orders', 'update', 'own', { owner: orderOwnerOnUpdate }), controller.update);

/* DELETE orders/:id - eliminar (orders:delete:any) */
router.delete('/:id', authorize('orders', 'delete', 'any'), controller.destroy);

module.exports = router;
