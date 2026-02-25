var express = require('express');
var router = express.Router();

const collectorController = require('../controllers/collectorController');
const { verifyToken, requireAdmin } = require('../middlewares/auth');

// Admin-only collectors endpoint
router.get('/', verifyToken, requireAdmin, collectorController.getAllMembers);

module.exports = router;

