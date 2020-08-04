const router = require('express').Router();
const productController = require('../controllers/product');

router.get('/all', productController.getAllProducts);
router.post('/add', productController.createNewProduct);
router.post('/like/:id', productController.likeProduct);
router.post('/delete/:id', productController.deleteProduct);

module.exports = router;