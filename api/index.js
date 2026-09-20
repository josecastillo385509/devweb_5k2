const express = require('express');

const router = express.Router();

router.use('/users', require('./users/routes/users.routes'));
router.use('/roles', require('./roles/routes/roles.routes'));
router.use('/permissions', require('./permissions/routes/permissions.routes'));
router.use('/products', require('./products/routes/products.routes'));
router.use('/variants', require('./variants/routes/variants.routes'));
router.use('/inventory', require('./inventory/routes/inventory.routes'));
router.use('/customers', require('./customers/routes/customers.routes'));
router.use('/orders', require('./orders/routes/orders.routes'));

module.exports = router;
