const express = require('express');
const controller = require('../controllers/users');
const { authenticate } = require('../api/authenticate');
const { authorize } = require('../api/authorize');
const { userOwner } = require('../api/ownership');

const router = express.Router();

// Autenticación (401) y después autorización RBAC (403) en cada endpoint
router.use(authenticate);

// users:create:any / users:read:any / users:delete:any -> solo roles con el alcance "any"
router.post('/', authorize('users', 'create', 'any'), controller.create);
router.get('/', authorize('users', 'read', 'any'), controller.list);
router.delete('/:id', authorize('users', 'delete', 'any'), controller.destroy);

// users:read:own / users:update:own -> un usuario solo puede ver y editar su propio registro
router.get('/:id', authorize('users', 'read', 'own', { owner: userOwner }), controller.find);
router.put('/:id', authorize('users', 'update', 'own', { owner: userOwner }), controller.update);

module.exports = router;
