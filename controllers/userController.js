const UserModel = require('../models/user/UserModel')
const { generateToken } = require('../utils/generateToken')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const otpGenerator = require('otp-generator')
const { welcomeEmail } = require('../utils/sendEmail')
const TokenModel = require('../models/user/tokenModel')
const crypto = import("crypto");

const registerUser = async (req, res) => {
  const { username, password, email, phone } = req.body
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
      phone,
      isVerified
    })

    // const token = generateToken(user._id)

    // res.cookie('token', token, {
    //   path: '/',
    //   httpOnly: true,
    //   expires: new Date(Date.now() + 1000 * 86400),
    // })

    let token = await new TokenModel({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();

    const message = `Click here to verify your email ${process.env.BASE_URL}/user/verify/${user.id}/${token.token}`

    const subject = 'An Email sent to your account please verify'
    const send_to = user.email
    const send_from = process.env.EMAIL_USER

    await welcomeEmail(subject, message, send_to, send_from)

    if (user) {
      const { _id, username, email, phone } = user
      res.status(201).json({
        _id,
        username,
        email,
        phone,
        token
      })
    } else {
      res.status(400)
      throw new Error('Invalid user data')
    }
  } catch (error) {
    console.log(error)
  }
}

const verifyEmail = async (req, res) => {
  try {
    const user = await UserModel.findOne({ _id: req.params.id });
    if (!user) return res.status(400).send("Invalid link");

    const token = await TokenModel.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send("Invalid link");

    await UserModel.updateOne({ _id: user._id, isVerified: true });
    await TokenModel.findByIdAndRemove(token._id);

    res.send("email verified sucessfully");
  } catch (error) {
    res.status(400).send("An error occured");
  }
}

const loginUser = async (req, res) => {
  const { email, password } = req.body

  try {
    if (!email || !password) {
      res.status(400)
      throw new Error('Please provide all fields')
    }

    const user = await UserModel.findOne({ email })
    if (!user) {
      res.status(400)
      throw new Error('User does not exists')
    }

    const token = generateToken(user._id)

    res.cookie('token', token, {
      path: '/',
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400),
      // sameSite: "none",
      // secure: true,
    })

    const passwordCorrect = await bcrypt.compare(password, user.password)

    // if (user && await user.matchPassword(password)) {
    if (user && passwordCorrect) {
      const { _id, username, email, phone } = user
      res.status(201).json({
        _id,
        username,
        email,
        phone,
        token,
      })
    } else {
      res.status(400)
      throw new Error('Invalid login details')
    }
  } catch (error) {
    console.log(error)
  }
}

const getUser = async (req, res) => {
  const user = await UserModel.findById(req.user._id)
  try {
    if (!user) {
      res.status(404)
      throw new Error('User not found')
    }

    if (user) {
      const { _id, username, email, phone, isVerified } = user
      res.status(200).json({
        _id,
        username,
        email,
        phone,
        isVerified,
      })
    } else {
      res.status(404)
      throw new Error('User not found')
    }
  } catch (error) {
    console.log(error)
  }
}

const loginStatus = async (req, res) => {
  const token = req.cookies.token
  try {
    if (!token) {
      return res.json(false)
    }
    // Verify Token
    const verified = jwt.verify(token, process.env.JWT_SECRET)
    if (verified) {
      return res.json(true)
    }
    return res.json(false)
  } catch (error) {
    console.log(error)
  }
}

const logoutUser = async (req, res) => {
  res.cookie('token', '', {
    path: '/',
    httpOnly: true,
    expires: new Date(Date.now() - 1000 * 86400),
    // sameSite: "none",
    // secure: true,
  })
  res.status(200).json({
    message: 'Logout Successful',
  })
}

const getOtp = async (req, res) => {
  const newOtp = otpGenerator.generate(6, { digits: true })
  console.log('newOtp', newOtp)
}

module.exports = {
  registerUser,
  verifyEmail,
  loginUser,
  getUser,
  loginStatus,
  logoutUser,
  getOtp,
}
