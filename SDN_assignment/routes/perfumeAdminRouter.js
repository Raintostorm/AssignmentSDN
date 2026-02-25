var express = require('express');
var router = express.Router();

const perfumeController = require('../controllers/perfumeController');
const { verifyToken, requireAdmin } = require('../middlewares/auth');

// All routes here are admin-only
router.use(verifyToken, requireAdmin);

router
  .route('/')
  .get(perfumeController.getAllPerfumes)
  .post(perfumeController.createPerfume);

router
  .route('/:id')
  .get(perfumeController.getPerfumeById)
  .put(perfumeController.updatePerfume)
  .delete(perfumeController.deletePerfume);

module.exports = router;

