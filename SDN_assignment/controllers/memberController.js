const Member = require('../models/Member');

exports.getProfile = async function (req, res) {
  try {
    const member = await Member.findById(req.user.id).select('-password');
    if (!member) {
      return res.status(404).json({ status: false, message: 'Member not found.' });
    }

    // If the client expects HTML, render the profile page, otherwise return JSON
    if (req.accepts('html')) {
      return res.render('profile', { title: 'Profile', member });
    }

    res.json({ status: true, data: member });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.updateProfile = async function (req, res) {
  try {
    const { name, YOB, gender } = req.body;

    const updates = {};
    if (typeof name !== 'undefined') updates.name = name;
    if (typeof YOB !== 'undefined') updates.YOB = YOB;
    if (typeof gender !== 'undefined') updates.gender = gender;

    const updated = await Member.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
      select: '-password',
    });

    if (!updated) {
      return res.status(404).json({ status: false, message: 'Member not found.' });
    }

    res.json({ status: true, data: updated });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.changePassword = async function (req, res) {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ status: false, message: 'Old password and new password are required.' });
    }

    const member = await Member.findById(req.user.id);
    if (!member) {
      return res.status(404).json({ status: false, message: 'Member not found.' });
    }

    const isMatch = await member.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({ status: false, message: 'Old password is incorrect.' });
    }

    member.password = newPassword;
    await member.save();

    res.json({ status: true, message: 'Password changed successfully.' });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

