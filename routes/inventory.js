const express = require('express');
const { validateNumericId } = require('../api/validate-id');
const controller = require('../controllers/inventory');
const { authenticate } = require('../api/authenticate');
const { authorize } = require('../api/authorize');

const router = express.Router();

// Autenticación (401) y después autorización RBAC (403) en cada endpoint
router.use(authenticate);

// Valida el parámetro :id (entero positivo) antes de llegar al controlador
router.param('id', validateNumericId);

/* POST inventory - crear */
router.post('/', authorize('inventory', 'create', 'any'), controller.create);

/* GET inventory - listar */
router.get('/', authorize('inventory', 'read', 'any'), controller.list);

/* GET inventory/:id - obtener uno */
router.get('/:id', authorize('inventory', 'read', 'any'), controller.find);

/* PUT inventory/:id - actualizar */
router.put('/:id', authorize('inventory', 'update', 'any'), controller.update);

/* DELETE inventory/:id - eliminar */
router.delete('/:id', authorize('inventory', 'delete', 'any'), controller.destroy);

module.exports = router;
