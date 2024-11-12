const express = require('express');
const { updateLocation, getLocations } = require('../controllers/locationController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, updateLocation);

// New route to get the locations for a list of userIds
router.post('/getLocations', authMiddleware, getLocations);

module.exports = router;
