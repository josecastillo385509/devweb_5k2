const express = require('express');
const { validateNumericId } = require('../../middlewares/validate-id');
const controller = require('../controllers/permissions.controller');

const router = express.Router();

// Valida el parámetro :id (entero positivo) antes de llegar al controlador
router.param('id', validateNumericId);

/* POST permissions - crear */
router.post('/', controller.create);

/* GET permissions - listar */
router.get('/', controller.list);

/* GET permissions/:id - obtener uno */
router.get('/:id', controller.find);

/* PUT permissions/:id - actualizar */
router.put('/:id', controller.update);

/* DELETE permissions/:id - eliminar */
router.delete('/:id', controller.destroy);

module.exports = router;
