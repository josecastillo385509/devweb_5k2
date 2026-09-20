const express = require('express');
// const { validateNumericId } = require('../../middlewares/validate-id');
const controller = require('../controllers/users.controller');

const router = express.Router();

// Comenta la validación si aún no existe el archivo middleware
// router.param('id', validateNumericId);

/* POST users - crear */
router.post('/', controller.create);

/* GET users - listar */
router.get('/', controller.list);

/* GET users/:id - obtener uno */
router.get('/:id', controller.find);

/* PUT users/:id - actualizar */
router.put('/:id', controller.update);

/* DELETE users/:id - eliminar */
router.delete('/:id', controller.destroy);

module.exports = router;