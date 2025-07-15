const express = require('express');
const { getAllActivePlans } = require('../controllers/planController');
const router = express.Router();
router.get('/', getAllActivePlans);
module.exports = router;