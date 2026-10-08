const express = require('express');
const { validateNumericId } = require('../api/validate-id');
const controller = require('../controllers/inventory');

const router = express.Router();

// Valida el parámetro :id (entero positivo) antes de llegar al controlador
router.param('id', validateNumericId);

/* POST inventory - crear */
router.post('/', controller.create);

/* GET inventory - listar */
router.get('/', controller.list);

/* GET inventory/:id - obtener uno */
router.get('/:id', controller.find);

/* PUT inventory/:id - actualizar */
router.put('/:id', controller.update);

/* DELETE inventory/:id - eliminar */
router.delete('/:id', controller.destroy);

module.exports = router;