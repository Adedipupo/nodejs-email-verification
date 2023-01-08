const express = require('express')
const {
  registerUser,
  loginUser,
  getUser,
  loginStatus,
  logoutUser,
} = require('../controllers/userController')

const router = express.Router()

router.post('/signup', registerUser)
router.post('/login', loginUser)
router.get('/me', getUser)
router.get('/status', loginStatus)
router.post('/logout', logoutUser)

module.exports = router
