const express = require('express')
const {
  registerUser,
  loginUser,
  getUser,
  loginStatus,
  logoutUser,
  getOtp,
  verifyEmail,
} = require('../controllers/userController');
const {verifyUser} = require('../middleware/authMiddleware');

const router = express.Router()

router.post('/signup', registerUser)
router.get('/verify/:id/:token', verifyEmail)
router.post('/login', loginUser)
router.get('/me',verifyUser, getUser)
router.get('/status', loginStatus)
router.post('/logout', logoutUser)

module.exports = router;
