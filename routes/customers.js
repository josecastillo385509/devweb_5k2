const express = require('express');
const { validateObjectId } = require('../api/validate-id');
const controller = require('../controllers/customers');
const { authenticate } = require('../api/authenticate');
const { authorize } = require('../api/authorize');
const { customerOwner, customerOwnerOnUpdate, customerOwnerOnCreate } = require('../api/ownership');

const router = express.Router();

// Autenticación (401) y después autorización RBAC (403) en cada endpoint
router.use(authenticate);

// Los clientes viven en MongoDB: el :id es un ObjectId
router.param('id', validateObjectId);

/* POST customers - crear (customers:create:any, o :own si el cliente queda a nombre del usuario) */
router.post('/', authorize('customers', 'create', 'own', { owner: customerOwnerOnCreate }), controller.create);

/* GET customers - listar (customers:read:any) */
router.get('/', authorize('customers', 'read', 'any'), controller.list);

/* GET customers/mine - clientes del usuario autenticado (customers:read:own) */
router.get('/mine', authorize('customers', 'read', 'own'), controller.mine);

/* GET customers/:id - obtener uno (customers:read:own con verificación de propiedad) */
router.get('/:id', authorize('customers', 'read', 'own', { owner: customerOwner }), controller.find);

/* PUT customers/:id - actualizar (customers:update:own con verificación de propiedad) */
router.put('/:id', authorize('customers', 'update', 'own', { owner: customerOwnerOnUpdate }), controller.update);

/* DELETE customers/:id - eliminar (customers:delete:any) */
router.delete('/:id', authorize('customers', 'delete', 'any'), controller.destroy);

module.exports = router;
