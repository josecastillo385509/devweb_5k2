const express = require('express');
const controller = require('../controllers/roles');
const { authenticate } = require('../api/authenticate');
const { authorize } = require('../api/authorize');

const router = express.Router();

// Autenticación (401) y después autorización RBAC (403) en cada endpoint
router.use(authenticate);

router.post('/', authorize('roles', 'create', 'any'), controller.create);
router.get('/', authorize('roles', 'read', 'any'), controller.list);
router.get('/:id', authorize('roles', 'read', 'any'), controller.find);
router.put('/:id', authorize('roles', 'update', 'any'), controller.update);
router.delete('/:id', authorize('roles', 'delete', 'any'), controller.destroy);

module.exports = router;
