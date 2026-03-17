const express = require('express');
const router  = express.Router();
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getCategories } = require('../controllers/productController');
const { protect }   = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');
const { validate, productSchema } = require('../utils/validate');

router.use(protect);

router.get('/categories',    getCategories);
router.get('/',              getProducts);
router.get('/:id',           getProductById);
router.post('/',             adminOnly, validate(productSchema), createProduct);
router.put('/:id',           adminOnly,                          updateProduct);
router.delete('/:id',        adminOnly,                          deleteProduct);

module.exports = router;
