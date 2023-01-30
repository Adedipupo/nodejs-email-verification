const express = require('express');
const { createOrder } = require('../controllers/orderController');
const { verifyUser } = require('../middleware/authMiddleware');


const router = express.Router()

router.post('/create',verifyUser, createOrder )


module.exports = router;
