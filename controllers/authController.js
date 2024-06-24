const asyncHandler = require("express-async-handler");
const Users = require("../models/userModel");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const { Cart } = require("../models/cartModel");

/**
 * Registers a new user.
 * @param {Request} req - The request object containing username, email, password, and isAdmin fields.
 * @param {Response} res - The response object.
 * @throws {Error} Throws an error if username, email, or password are missing, or if username or email is already taken.
 */
const userRegister = asyncHandler(async (req, res) => {
     const { username, email, password, isAdmin } = req.body;

     if (!username || !email || !password) {
          res.status(400);
          throw new Error("All fields are mandatory");
     }

     const usernameAvailable = await Users.findOne({ username });
     if (usernameAvailable) {
          throw new Error("Username already taken");
     }

     const emailAvailable = await Users.findOne({ email });
     if (emailAvailable) {
          throw new Error("Email already taken");
     } else {
          const hashedPassword = CryptoJS.AES.encrypt(
               password,
               process.env.PASSWORD_KEY
          ).toString();
          const user = await Users.create({
               username,
               email,
               password: hashedPassword,
               isAdmin,
          });

          if (user) {
               const { password, ...others } = user._doc;
               res.status(201).json(others);
          } else {
               res.status(400);
               throw new Error("Failed to register user");
          }
     }
});

/**
 * Logs in an existing user.
 * @param {Request} req - The request object containing email and password fields.
 * @param {Response} res - The response object.
 * @throws {Error} Throws an error if email or password are missing, if no user with the given email is found, or if the password is incorrect.
 */
const loginUser = asyncHandler(async (req, res) => {
     const { email, password } = req.body;

     if (!email || !password) {
          res.status(400);
          throw new Error("All fields are mandatory");
     }

     const user = await Users.findOne({ email });

     if (!user) {
          res.status(400);
          throw new Error("No such user");
     }

     const decryptedPassword = CryptoJS.AES.decrypt(
          user.password,
          process.env.PASSWORD_KEY
     ).toString(CryptoJS.enc.Utf8);

     if (decryptedPassword !== password) {
          res.status(400);
          throw new Error("Invalid password");
     }

     const accessToken = jwt.sign(
          {
               _id: user._id,
               isAdmin: user.isAdmin,
          },
          process.env.JWT_KEY,
          { expiresIn: "1d" }
     );

     let cart = await Cart.findOne({ userId: user._id });
     if (!cart) {
          await Cart.create({
               userId: user._id,
               products: [],
          });
     }

     res.status(200).json({
          _id: user._id,
          username: user.username,
          email: user.email,
          accessToken,
          isAdmin: user.isAdmin,
     });
});

module.exports = { userRegister, loginUser };
