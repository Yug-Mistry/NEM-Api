const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

// Middleware function to validate JWT token from Authorization header.
const validateToken = (req, res, next) => {
     const authHeader = req.headers.Authorization || req.headers.authorization;

     if (authHeader && authHeader.startsWith("Bearer")) {
          const token = authHeader.split(" ")[1];

          jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
               if (err) {
                    return res.status(401).json("Token is not valid");
               }

               req.user = decoded; // Store decoded user information in req.user
               next(); // Proceed to the next middleware or route handler
          });
     } else {
          return res.status(401).json("You are not authenticated");
     }
};

// Middleware function to validate JWT token and user authorization.
const validateTokenAndAuth = (req, res, next) => {
     validateToken(req, res, () => {
          if (req.user._id == req.params.id || req.user.isAdmin) {
               next(); // Proceed if user ID matches or user is an admin
          } else {
               res.status(403).json("You do not have permission"); // Forbidden if not authorized
          }
     });
};

// Middleware function to validate JWT token and ensure the user is an admin.
const AdminAuth = (req, res, next) => {
     validateToken(req, res, () => {
          if (req.user.isAdmin) {
               next(); // Proceed if user is an admin
          } else {
               res.status(403).json("Only admin has access"); // Forbidden if not an admin
          }
     });
};

module.exports = { validateToken, validateTokenAndAuth, AdminAuth };
