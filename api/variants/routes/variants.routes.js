const express = require('express');
const router = express.Router();
const variantsController = require('../controllers/variants.controller');

router.get('/', variantsController.getAllVariants);
router.get('/:id', variantsController.getVariantById);
router.post('/', variantsController.createVariant);
router.put('/:id', variantsController.updateVariant);
router.delete('/:id', variantsController.deleteVariant);

module.exports = router;