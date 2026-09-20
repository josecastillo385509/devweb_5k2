const express = require('express');
const { validateNumericId } = require('../../middlewares/validate-id');
const controller = require('../controllers/variants.controller');

const router = express.Router();

// Valida el parámetro :id (entero positivo) antes de llegar al controlador
router.param('id', validateNumericId);

/* POST variants - crear */
router.post('/', controller.create);

/* GET variants - listar */
router.get('/', controller.list);

/* GET variants/:id - obtener uno */
router.get('/:id', controller.find);

/* PUT variants/:id - actualizar */
router.put('/:id', controller.update);

/* DELETE variants/:id - eliminar */
router.delete('/:id', controller.destroy);

module.exports = router;