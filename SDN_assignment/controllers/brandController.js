const Brand = require('../models/Brand');
const { Perfume } = require('../models/Perfume');

exports.getAllBrandsPublic = async function (req, res) {
  try {
    const brands = await Brand.find({});
    res.json({ status: true, data: brands });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Admin APIs
exports.getAllBrands = async function (req, res) {
  try {
    const brands = await Brand.find({});
    if (req.accepts('html')) {
      return res.render('admin_brands', { title: 'Admin - Brands', brands });
    }
    res.json({ status: true, data: brands });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.createBrand = async function (req, res) {
  try {
    const { brandName } = req.body;
    if (!brandName) {
      return res.status(400).json({ status: false, message: 'brandName is required.' });
    }

    const brand = await Brand.create({ brandName });
    res.status(201).json({ status: true, data: brand });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.getBrandById = async function (req, res) {
  try {
    const brand = await Brand.findById(req.params.brandId);
    if (!brand) {
      return res.status(404).json({ status: false, message: 'Brand not found.' });
    }
    res.json({ status: true, data: brand });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.updateBrand = async function (req, res) {
  try {
    const { brandName } = req.body;
    const updates = {};
    if (typeof brandName !== 'undefined') updates.brandName = brandName;

    const brand = await Brand.findByIdAndUpdate(req.params.brandId, updates, {
      new: true,
      runValidators: true,
    });

    if (!brand) {
      return res.status(404).json({ status: false, message: 'Brand not found.' });
    }

    res.json({ status: true, data: brand });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.deleteBrand = async function (req, res) {
  try {
    const brandId = req.params.brandId;

    const perfumeCount = await Perfume.countDocuments({ brand: brandId });
    if (perfumeCount > 0) {
      return res.status(400).json({
        status: false,
        message: 'Cannot delete brand with associated perfumes.',
      });
    }

    const deleted = await Brand.findByIdAndDelete(brandId);
    if (!deleted) {
      return res.status(404).json({ status: false, message: 'Brand not found.' });
    }

    res.json({ status: true, message: 'Brand deleted successfully.' });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


