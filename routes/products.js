const express = require('express');
const controller = require('../controllers/products');
const { authenticate } = require('../api/authenticate');
const { authorize } = require('../api/authorize');

const router = express.Router();

// Autenticación (401) y después autorización RBAC (403) en cada endpoint
router.use(authenticate);

router.post('/', authorize('products', 'create', 'any'), controller.create);
router.get('/', authorize('products', 'read', 'any'), controller.list);
router.get('/:id', authorize('products', 'read', 'any'), controller.find);
router.put('/:id', authorize('products', 'update', 'any'), controller.update);
router.delete('/:id', authorize('products', 'delete', 'any'), controller.destroy);

module.exports = router;
