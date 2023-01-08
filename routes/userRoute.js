const express = require('express');
const { registerUser } = require('../controllers/userController');

const router = express.Router();

console.log("here111")
router.post('/signup', registerUser);
console.log("hererrr")



module.exports = router;