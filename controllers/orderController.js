const asyncHandler = require('express-async-handler')
const Users = require('../models/userModel')
// const Carts = require('../models/cartModel')
const { Cart } = require("../models/cartModel");
const Products = require('../models/productModel')
const Orders = require('../models/orderModel')
const uniqid = require('uniqid')

createOrder = asyncHandler(async(req,res)=>{
    // const COD = req.body
    const { address, email, contact, cartTotal } = req.body
    const userId = req.user._id
    // if (!COD) throw new Error('Cash Order is Mandatory')
    const user = await Users.findById(userId)
    // const userCart = await Carts.findOne({orderby: user._id})
    const userCart = await Cart.findOne({userId: user._id})
    // console.log(cartTotal);
    const finalAmount = cartTotal
    const newOrder = await new Orders({
        products: userCart.products,
        paymentIntent: {
            id: uniqid(),
            method: 'COD',
            amount: finalAmount,
            status: 'Cash on Delivery',
            created: Date.now(),
            currency: 'USD'
        },
        orderby: user._id,
        email: email,
        address: address,
        contact: contact,
        orderStatus: 'Cash on Delivery'
    }).save()
  
    res.json({message: 'Success'})
})


getUserOrders = asyncHandler(async (req, res) => {
    const userId= req.user._id
    // console.log(userId)
    const userOrders = await Orders.find({ orderby: userId })
        .populate("products.productId")
        .populate("orderby")
        .exec()
    if(userOrders.length) res.json([userOrders])
    else res.json({msg: 'No Orders Found'})
})


module.exports = { createOrder, getUserOrders }