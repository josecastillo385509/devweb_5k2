var express = require('express');
var router = express.Router();
var controller = require('../controllers/index');

router.use('/users', require('../routes/users'));
router.use('/roles', require('../routes/roles'));
router.use('/permissions', require('../routes/permissions'));
router.use('/products', require('../routes/products'));
router.use('/variants', require('../routes/variants'));
router.use('/inventory', require('../routes/inventory'));
router.use('/customers', require('../routes/customers'));
router.use('/orders', require('../routes/orders'));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/health', controller.healthCheck);
module.exports = router;

/*
const express = require('express');

const router = express.Router();

router.use('/users', require('./users/routes/users.routes'));
router.use('/roles', require('./roles/routes/roles.routes'));
router.use('/permissions', require('./permissions/routes/permissions.routes'));
router.use('/products', require('./products/routes/products.routes'));
router.use('/variants', require('./variants/routes/variants.routes'));
router.use('/inventory', require('./inventory/routes/inventory'));
router.use('/customers', require('../routes/customers'));
router.use('/orders', require('./orders/routes/orders.routes'));

module.exports = router;
*/