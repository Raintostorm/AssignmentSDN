const jwt = require('jsonwebtoken');
const Member = require('../models/Member');

function getTokenFromRequest(req) {
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }

  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  return null;
}

exports.verifyToken = function (req, res, next) {
  const token = getTokenFromRequest(req);

  if (!token) {
    return res.status(401).json({ status: false, message: 'Authentication token missing.' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'default_jwt_secret';
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ status: false, message: 'Invalid or expired token.' });
  }
};

exports.requireMember = function (req, res, next) {
  if (!req.user) {
    return res.status(401).json({ status: false, message: 'You must be logged in.' });
  }
  next();
};

exports.requireAdmin = async function (req, res, next) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ status: false, message: 'You must be logged in.' });
    }

    const member = await Member.findById(req.user.id);
    if (!member || !member.isAdmin) {
      return res.status(403).json({ status: false, message: 'Admin privileges required.' });
    }

    // Refresh user info from database to avoid relying on stale token data
    req.user = {
      id: member._id,
      email: member.email,
      isAdmin: member.isAdmin,
    };

    next();
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

