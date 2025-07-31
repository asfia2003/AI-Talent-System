 
// const express = require('express');
// const router = express.Router();
// const controller = require('../controllers/dashboardController');

// router.get('/dashboard', controller.renderDashboard);

// module.exports = router;


const express = require('express');
const router = express.Router();

const dashboardController = require('../controllers/dashboardController');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

// 🔐 Protect this route
router.get('/', ensureAuthenticated, dashboardController.renderDashboard);

module.exports = router;
