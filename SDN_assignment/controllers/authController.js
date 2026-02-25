const jwt = require('jsonwebtoken');
const Member = require('../models/Member');

function generateToken(member) {
  const payload = {
    id: member._id,
    email: member.email,
    isAdmin: member.isAdmin,
  };

  const secret = process.env.JWT_SECRET || 'default_jwt_secret';

  return jwt.sign(payload, secret, { expiresIn: '1d' });
}

exports.register = async function (req, res) {
  try {
    const { email, password, name, YOB, gender } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ status: false, message: 'Email, password and name are required.' });
    }

    const existing = await Member.findOne({ email });
    if (existing) {
      return res.status(400).json({ status: false, message: 'Email already registered.' });
    }

    const member = await Member.create({
      email,
      password,
      name,
      YOB,
      gender,
      isAdmin: false,
    });

    const token = generateToken(member);
    res
      .cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
      })
      .status(201)
      .json({
        status: true,
        message: 'Registration successful.',
        data: {
          id: member._id,
          email: member.email,
          name: member.name,
          isAdmin: member.isAdmin,
        },
      });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.login = async function (req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: false, message: 'Email and password are required.' });
    }

    const member = await Member.findOne({ email });
    if (!member) {
      return res.status(401).json({ status: false, message: 'Invalid email or password.' });
    }

    const isMatch = await member.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ status: false, message: 'Invalid email or password.' });
    }

    const token = generateToken(member);
    res
      .cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
      })
      .json({
        status: true,
        message: 'Login successful.',
        data: {
          id: member._id,
          email: member.email,
          name: member.name,
          isAdmin: member.isAdmin,
        },
      });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.logout = function (req, res) {
  res
    .clearCookie('token')
    .json({ status: true, message: 'Logged out successfully.' });
};

