const Member = require('../models/Member');

exports.getAllMembers = async function (req, res) {
  try {
    const members = await Member.find({}).select('-password');

    if (req.accepts('html')) {
      return res.render('collectors', { title: 'Collectors', members });
    }

    res.json({ status: true, data: members });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

