const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orders.controller');

router.get('/', ordersController.getAllOrders);
router.get('/:id', ordersController.getOrderById);
router.post('/', ordersController.createOrder);
router.put('/:id/status', ordersController.updateOrderStatus);

module.exports = router;