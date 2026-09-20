const express = require('express');
const { validateNumericId } = require('../../middlewares/validate-id');
const controller = require('../controllers/customers.controller');

const router = express.Router();

// Valida el parámetro :id antes de llegar al controlador
router.param('id', validateNumericId);

/* POST customers - crear */
router.post('/', controller.create);

/* GET customers - listar */
router.get('/', controller.list);

/* GET customers/:id - obtener uno */
router.get('/:id', controller.find);

/* PUT customers/:id - actualizar */
router.put('/:id', controller.update);

/* DELETE customers/:id - eliminar */
router.delete('/:id', controller.destroy);

module.exports = router;