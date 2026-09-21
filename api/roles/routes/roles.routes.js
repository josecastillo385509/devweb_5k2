const express = require('express');
const controller = require('../controllers/roles.controller');

const router = express.Router();

router.post('/', controller.create);
router.get('/', controller.list);
router.get('/:id', controller.find);
router.put('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
