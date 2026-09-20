const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventory.controller');

router.get('/', inventoryController.getAllInventory);
router.get('/:id', inventoryController.getInventoryById);
router.put('/:id', inventoryController.updateInventory);

module.exports = router;