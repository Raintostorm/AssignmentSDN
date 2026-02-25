var express = require('express');
var router = express.Router();

const perfumeController = require('../controllers/perfumeController');
const { verifyToken, requireMember } = require('../middlewares/auth');
const { Perfume } = require('../models/Perfume');

// Public routes for perfumes (JSON APIs)
router.get('/', perfumeController.getAllPerfumes);
router.get('/search', perfumeController.searchPerfumesByName);
router.get('/filter', perfumeController.filterPerfumesByBrand);
router.get('/:id', perfumeController.getPerfumeById);

// Member-only feedback route
router.post('/:id/comments', verifyToken, requireMember, perfumeController.addComment);

// View route for perfume detail page
router.get('/:id/view', async function (req, res, next) {
  try {
    const perfume = await Perfume.findById(req.params.id)
      .populate('brand')
      .populate('comments.author');

    if (!perfume) {
      return res.status(404).render('error', {
        message: 'Perfume not found',
        error: {},
      });
    }

    res.render('perfume_detail', {
      title: perfume.perfumeName,
      perfume,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

