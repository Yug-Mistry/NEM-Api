const { isValidObjectId } = require("mongoose");
const { Cart } = require("../models/cartModel");
const { Users } = require("../models/userModel");
const { Products } = require("../models/productModel");

/**
 * Adds an item to the user's cart.
 * @param {Request} req - The request object containing productId, title, price, image, and selectedQuentity fields.
 * @param {Response} res - The response object.
 * @throws {Error} Throws an error if userId is missing, productId is invalid, or if there are issues with finding or updating the cart.
 */
exports.addItemToCart = async (req, res) => {
     const userId = req.user._id;

     if (!userId) {
          res.status(400);
          throw new Error("No such user Found");
     }

     const { productId, title, price, image, selectedQuentity } = req.body;

     if (!productId || !isValidObjectId(productId)) {
          return res
               .status(400)
               .send({ status: false, message: "Invalid product" });
     }

     try {
          let productAvailable = await Products.findById(productId);

          if (!productAvailable) {
               return res
                    .status(404)
                    .send({ status: false, message: "Product not found" });
          }

          let cart = await Cart.findOne({ userId });

          if (cart) {
               let itemIndex = cart.products.findIndex(
                    (p) => p.productId == productId
               );

               if (itemIndex > -1) {
                    cart.products[itemIndex].quantity +=
                         parseInt(selectedQuentity);
               } else {
                    cart.products.push({
                         productId,
                         quantity: parseInt(selectedQuentity),
                         title,
                         image,
                         price,
                    });
               }

               cart = await cart.save();

               return res.status(200).send({ status: true, updatedCart: cart });
          } else {
               const newCart = await Cart.create({
                    userId,
                    products: [
                         {
                              productId,
                              quantity: parseInt(selectedQuentity),
                              title,
                              image,
                              price,
                         },
                    ],
               });

               return res
                    .status(201)
                    .send({ status: true, updatedCart: newCart });
          }
     } catch (error) {
          res.status(500).send({
               status: false,
               message: "Server error",
               error,
          });
     }
};

/**
 * Retrieves the user's cart.
 * @param {Request} req - The request object containing userId.
 * @param {Response} res - The response object.
 * @throws {Error} Throws an error if userId is missing or if there are issues with finding the cart.
 */
exports.getCart = async (req, res) => {
     const userId = req.user._id;

     if (!userId) {
          res.status(400);
          throw new Error("No such user Found");
     }

     try {
          let cart = await Cart.findOne({ userId });

          if (!cart) {
               return res
                    .status(404)
                    .send({
                         status: false,
                         message: "Cart not found for this user",
                    });
          }

          return res.status(200).send({ status: true, cart });
     } catch (error) {
          res.status(500).send({
               status: false,
               message: "Server error",
               error,
          });
     }
};

/**
 * Removes an item from the user's cart.
 * @param {Request} req - The request object containing productId and userId.
 * @param {Response} res - The response object.
 * @throws {Error} Throws an error if userId is missing, or if there are issues with finding or updating the cart.
 */
exports.removeItem = async (req, res) => {
     const userId = req.user._id;

     if (!userId) {
          res.status(400);
          throw new Error("No such user Found");
     }

     const { productId } = req.body;

     try {
          let cart = await Cart.findOne({ userId });

          if (!cart) {
               return res
                    .status(404)
                    .send({
                         status: false,
                         message: "Cart not found for this user",
                    });
          }

          let itemIndex = cart.products.findIndex(
               (p) => p.productId == productId
          );

          if (itemIndex > -1) {
               cart.products.splice(itemIndex, 1);
               cart = await cart.save();
               return res.status(200).send({ status: true, updatedCart: cart });
          } else {
               return res
                    .status(400)
                    .send({
                         status: false,
                         message: "Item does not exist in cart",
                    });
          }
     } catch (error) {
          res.status(500).send({
               status: false,
               message: "Server error",
               error,
          });
     }
};

/**
 * Deletes the entire cart of a user.
 * @param {Request} req - The request object containing userId.
 * @param {Response} res - The response object.
 * @throws {Error} Throws an error if userId is missing, or if there are issues with finding or deleting the cart.
 */
exports.deleteCart = async (req, res) => {
     const userId = req.user._id;

     if (!userId) {
          res.status(400);
          throw new Error("No such user Found");
     }

     try {
          const cart = await Cart.findOneAndDelete({ userId });

          if (!cart) {
               return res.status(404).send({ message: "Cart not found" });
          }

          return res.status(200).send({ message: "Cart deleted successfully" });
     } catch (error) {
          res.status(500).send({ message: "Server error", error });
     }
};

/**
 * Updates the quantity of an item in the user's cart.
 * @param {Request} req - The request object containing productId, quantity, and userId.
 * @param {Response} res - The response object.
 * @throws {Error} Throws an error if userId is missing, or if there are issues with finding or updating the cart.
 */
exports.updateCartItemQuantity = async (req, res) => {
     const userId = req.user._id;

     if (!userId) {
          res.status(400);
          throw new Error("No such user Found");
     }

     const { productId, quantity } = req.body;

     try {
          let cart = await Cart.findOne({ userId });

          if (!cart) {
               return res
                    .status(404)
                    .send({
                         status: false,
                         message: "Cart not found for this user",
                    });
          }

          let itemIndex = cart.products.findIndex(
               (p) => p.productId == productId
          );

          if (itemIndex > -1) {
               cart.products[itemIndex].quantity = quantity;
               cart = await cart.save();
               return res.status(200).send({ status: true, updatedCart: cart });
          } else {
               return res
                    .status(400)
                    .send({
                         status: false,
                         message: "Item does not exist in cart",
                    });
          }
     } catch (error) {
          res.status(500).send({
               status: false,
               message: "Server error",
               error,
          });
     }
};
