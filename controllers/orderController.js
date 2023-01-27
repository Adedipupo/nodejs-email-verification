const orderModel = require("../models/user/orderModel")


const createOrder = async (req, res) => {
    const { name, description } = req.body
  
    if (!name || !description) {
      res.status(400)
      throw new Error('Please provide all fields')
    }

  
    const order = await orderModel.create({
      user: req.user.id,
      name,
      description,
    })
  
    res.status(201).json({
      msg: 'order created successfully',
      data: order,
    })
  }
  
module.exports = {
    createOrder,
}  