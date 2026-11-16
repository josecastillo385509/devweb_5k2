const express = require('express');
const { validateNumericId } = require('../api/validate-id');
const controller = require('../controllers/variants');
const { authenticate } = require('../api/authenticate');
const { authorize } = require('../api/authorize');

const router = express.Router();

// Autenticación (401) y después autorización RBAC (403) en cada endpoint
router.use(authenticate);

// Valida el parámetro :id (entero positivo) antes de llegar al controlador
router.param('id', validateNumericId);

/* POST variants - crear */
router.post('/', authorize('variants', 'create', 'any'), controller.create);

/* GET variants - listar */
router.get('/', authorize('variants', 'read', 'any'), controller.list);

/* GET variants/:id - obtener uno */
router.get('/:id', authorize('variants', 'read', 'any'), controller.find);

/* PUT variants/:id - actualizar */
router.put('/:id', authorize('variants', 'update', 'any'), controller.update);

/* DELETE variants/:id - eliminar */
router.delete('/:id', authorize('variants', 'delete', 'any'), controller.destroy);

module.exports = router;
