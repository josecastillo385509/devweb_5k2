const express = require('express');
const controller = require('../controllers/permissions');
const { authenticate } = require('../api/authenticate');
const { authorize } = require('../api/authorize');

const router = express.Router();

// Autenticación (401) y después autorización RBAC (403) en cada endpoint
router.use(authenticate);

router.post('/', authorize('permissions', 'create', 'any'), controller.create);
router.get('/', authorize('permissions', 'read', 'any'), controller.list);
router.get('/:id', authorize('permissions', 'read', 'any'), controller.find);
router.put('/:id', authorize('permissions', 'update', 'any'), controller.update);
router.delete('/:id', authorize('permissions', 'delete', 'any'), controller.destroy);

module.exports = router;
