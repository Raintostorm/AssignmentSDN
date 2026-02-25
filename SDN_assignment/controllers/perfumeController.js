const { Perfume } = require('../models/Perfume');

exports.getAllPerfumes = async function (req, res) {
  try {
    const perfumes = await Perfume.find({}).populate('brand');
    if (req.accepts('html')) {
      return res.render('admin_perfumes', { title: 'Admin - Perfumes', perfumes });
    }
    res.json({ status: true, data: perfumes });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.getPerfumeById = async function (req, res) {
  try {
    const perfume = await Perfume.findById(req.params.id)
      .populate('brand')
      .populate('comments.author');
    if (!perfume) {
      return res.status(404).json({ status: false, message: 'Perfume not found.' });
    }
    res.json({ status: true, data: perfume });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.searchPerfumesByName = async function (req, res) {
  try {
    const name = req.query.name || '';
    const regex = new RegExp(name, 'i');
    const perfumes = await Perfume.find({ perfumeName: regex }).populate('brand');
    res.json({ status: true, data: perfumes });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.filterPerfumesByBrand = async function (req, res) {
  try {
    const brandId = req.query.brandId;

    if (!brandId) {
      return res.status(400).json({ status: false, message: 'brandId query parameter is required.' });
    }

    const perfumes = await Perfume.find({ brand: brandId }).populate('brand');
    res.json({ status: true, data: perfumes });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.addComment = async function (req, res) {
  try {
    const perfumeId = req.params.id;
    const { rating, content } = req.body;

    if (typeof rating === 'undefined' || !content) {
      return res.status(400).json({ status: false, message: 'Rating and content are required.' });
    }

    const perfume = await Perfume.findById(perfumeId).populate('comments.author');
    if (!perfume) {
      return res.status(404).json({ status: false, message: 'Perfume not found.' });
    }

    const userId = req.user.id;
    const hasCommented = perfume.comments.some(function (c) {
      return c.author && c.author.toString() === userId;
    });

    if (hasCommented) {
      return res.status(400).json({
        status: false,
        message: 'You have already commented on this perfume.',
      });
    }

    perfume.comments.push({
      rating,
      content,
      author: userId,
    });

    await perfume.save();

    res.status(201).json({
      status: true,
      message: 'Comment added successfully.',
      data: perfume,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Admin CRUD APIs
exports.createPerfume = async function (req, res) {
  try {
    const perfume = await Perfume.create(req.body);
    res.status(201).json({ status: true, data: perfume });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.updatePerfume = async function (req, res) {
  try {
    const perfume = await Perfume.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!perfume) {
      return res.status(404).json({ status: false, message: 'Perfume not found.' });
    }

    res.json({ status: true, data: perfume });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.deletePerfume = async function (req, res) {
  try {
    const deleted = await Perfume.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ status: false, message: 'Perfume not found.' });
    }

    res.json({ status: true, message: 'Perfume deleted successfully.' });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

