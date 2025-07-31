 const express = require('express');
const router = express.Router();
const controller = require('../controllers/settingsController');

router.get('/settings', controller.getSettings);
router.post('/settings', controller.saveSettings);

module.exports = router;

