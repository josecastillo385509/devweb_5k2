const express = require('express');

const router = express.Router();

router.use('/users', require('./users/routes/users.routes'));
router.use('/roles', require('./roles/routes/roles.routes'));
router.use('/permissions', require('./permissions/routes/permissions.routes'));
router.use('/products', require('./products/routes/products.routes'));

module.exports = router;
