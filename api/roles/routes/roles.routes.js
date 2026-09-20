const express = require('express');
const { validateNumericId } = require('../../middlewares/validate-id');
const controller = require('../controllers/roles.controller');

const router = express.Router();

// Valida el parámetro :id (entero positivo) antes de llegar al controlador
router.param('id', validateNumericId);

/* POST roles - crear */
router.post('/', controller.create);

/* GET roles - listar */
router.get('/', controller.list);

/* GET roles/:id - obtener uno */
router.get('/:id', controller.find);

/* PUT roles/:id - actualizar */
router.put('/:id', controller.update);

/* DELETE roles/:id - eliminar */
router.delete('/:id', controller.destroy);

module.exports = router;
