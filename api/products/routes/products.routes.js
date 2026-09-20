const express = require('express');
const { validateNumericId } = require('../../middlewares/validate-id');
const controller = require('../controllers/products.controller');

const router = express.Router();

// Valida el parámetro :id (entero positivo) antes de llegar al controlador
router.param('id', validateNumericId);

/* POST products - crear */
router.post('/', controller.create);

/* GET products - listar */
router.get('/', controller.list);

/* GET products/:id - obtener uno */
router.get('/:id', controller.find);

/* PUT products/:id - actualizar */
router.put('/:id', controller.update);

/* DELETE products/:id - eliminar */
router.delete('/:id', controller.destroy);

module.exports = router;
