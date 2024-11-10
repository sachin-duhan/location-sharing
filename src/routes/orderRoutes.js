const express = require('express');
const { sendOrder } = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, sendOrder);

module.exports = router;
