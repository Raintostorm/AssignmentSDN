var express = require('express');
var router = express.Router();

const memberController = require('../controllers/memberController');
const { verifyToken, requireMember } = require('../middlewares/auth');

// All routes below require authenticated member
router.use(verifyToken, requireMember);

router.get('/profile', memberController.getProfile);
router.post('/profile', memberController.updateProfile);
router.post('/change-password', memberController.changePassword);

module.exports = router;

