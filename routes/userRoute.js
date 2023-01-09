const express = require('express')
const {
  registerUser,
  loginUser,
  getUser,
  loginStatus,
  logoutUser,
  getOtp,
} = require('../controllers/userController');
const {verifyUser} = require('../middleware/authMiddleware');

const router = express.Router()

router.get('/otp', getOtp)
router.post('/signup', registerUser)
router.post('/login', loginUser)
router.get('/me',verifyUser, getUser)
router.get('/status', loginStatus)
router.post('/logout', logoutUser)

module.exports = router;
