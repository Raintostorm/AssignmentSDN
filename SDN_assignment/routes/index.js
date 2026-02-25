var express = require('express');
var router = express.Router();

const { Perfume } = require('../models/Perfume');
const Brand = require('../models/Brand');

/* GET home page - list perfumes with search & filter */
router.get('/', async function (req, res, next) {
  try {
    const name = req.query.name || '';
    const brandId = req.query.brandId || '';

    const filter = {};
    if (name) {
      filter.perfumeName = new RegExp(name, 'i');
    }
    if (brandId) {
      filter.brand = brandId;
    }

    const [perfumes, brands] = await Promise.all([
      Perfume.find(filter).populate('brand'),
      Brand.find({}),
    ]);

    res.render('index', {
      title: 'Perfume Collection',
      perfumes,
      brands,
      searchName: name,
      selectedBrandId: brandId,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
