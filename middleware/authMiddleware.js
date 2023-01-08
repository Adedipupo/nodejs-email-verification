const jwt = require('jsonwebtoken')
const UserModel = require('../models/user/UserModel')

const verifyUser = async (req, res, next) => {
    try {
        const token = req.cookies.token
        if (!token) {
          res.status(401)
          throw new Error('Not authorized, please login')
        }
    
        // Verify Token
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        // Get user id from token
        const user = await UserModel.findById(verified.id).select('-password')
    
        if (!user) {
          res.status(401)
          throw new Error('User not found')
        }
        req.user = user
        next()
      } catch (error) {
        res.status(401)
        throw new Error('Not authorized, please login')
      }
}

module.exports = {
    verifyUser
}
