var express = require('express');
var router = express.Router();

const brandController = require('../controllers/brandController');
const { verifyToken, requireAdmin } = require('../middlewares/auth');

// Public brands list (for filtering perfumes)
router.get('/public', brandController.getAllBrandsPublic);

// Admin CRUD for brands
router
  .route('/')
  .get(verifyToken, requireAdmin, brandController.getAllBrands)
  .post(verifyToken, requireAdmin, brandController.createBrand);

router
  .route('/:brandId')
  .get(verifyToken, requireAdmin, brandController.getBrandById)
  .put(verifyToken, requireAdmin, brandController.updateBrand)
  .delete(verifyToken, requireAdmin, brandController.deleteBrand);

module.exports = router;

