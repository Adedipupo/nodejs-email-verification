const UserModel = require("../models/user/UserModel");


const registerUser = async(req,res) => {
    const { username, password, email,phone } = req.body;
    try {

        if (!username || !email || !password || !phone) {
            res.status(400)
            throw new Error('Please provide all fields')
          }
        
          const userExists = await UserModel.findOne({ email })
          if (userExists) {
            res.status(400)
            throw new Error('User already exists')
          }
        
          const user = await UserModel.create({
            username,
            email,
            password,
            phone
          })
        
          console.log("user", user)
        //   const token = generateToken(user._id)
        
        //   res.cookie('token', token, {
        //     path: '/',
        //     httpOnly: true,
        //     expires: new Date(Date.now() + 1000 * 86400),
        //   })
        
          if (user) {
            const { _id, username, email, phone, } = user
            res.status(201).json({
              _id,
              username,
              email,
              phone,
            //   token,
            })
          } else {
            res.status(400)
            throw new Error('Invalid user data')
          }
    } catch (error) {
        console.log(error)
    }
};

module.exports = {
    registerUser
}