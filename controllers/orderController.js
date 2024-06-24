const asyncHandler = require("express-async-handler");
const Users = require("../models/userModel");
const { Cart } = require("../models/cartModel");
const Products = require("../models/productModel");
const Orders = require("../models/orderModel");
const uniqid = require("uniqid");

/**
 * Creates a new order for the user with Cash on Delivery method.
 * @param {Request} req - The request object containing address, email, contact, and cartTotal fields.
 * @param {Response} res - The response object.
 * @throws {Error} Throws an error if userId is missing, or if there are issues with finding user details or creating the order.
 */
createOrder = asyncHandler(async (req, res) => {
     const { address, email, contact, cartTotal } = req.body;
     const userId = req.user._id;

     if (!userId) {
          res.status(400);
          throw new Error("No such user Found");
     }

     try {
          const user = await Users.findById(userId);
          const userCart = await Cart.findOne({ userId: user._id });

          if (!userCart || userCart.products.length === 0) {
               res.status(400);
               throw new Error("User cart is empty");
          }

          const finalAmount = cartTotal; // Assuming cartTotal is validated or calculated correctly

          const newOrder = await Orders.create({
               products: userCart.products,
               paymentIntent: {
                    id: uniqid(),
                    method: "COD",
                    amount: finalAmount,
                    status: "Cash on Delivery",
                    created: Date.now(),
                    currency: "USD",
               },
               orderby: user._id,
               email,
               address,
               contact,
               orderStatus: "Cash on Delivery",
          });

          res.json({ message: "Order created successfully" });
     } catch (error) {
          res.status(500).json({ message: "Failed to create order", error });
     }
});

/**
 * Retrieves all orders placed by the current user.
 * @param {Request} req - The request object containing userId.
 * @param {Response} res - The response object.
 * @throws {Error} Throws an error if userId is missing or if there are issues with retrieving user orders.
 */
getUserOrders = asyncHandler(async (req, res) => {
     const userId = req.user._id;

     if (!userId) {
          res.status(400);
          throw new Error("No such user Found");
     }

     try {
          const userOrders = await Orders.find({ orderby: userId })
               .populate("products.productId")
               .populate("orderby")
               .exec();

          if (userOrders.length > 0) {
               res.json(userOrders);
          } else {
               res.json({ msg: "No Orders Found" });
          }
     } catch (error) {
          res.status(500).json({
               message: "Failed to fetch user orders",
               error,
          });
     }
});

module.exports = { createOrder, getUserOrders };
