const router = require("express").Router();
const { userRegister, loginUser } = require("../controllers/authController");

// Route to register a new user
router.post("/register", userRegister);

// Route to login an existing user
router.post("/login", loginUser);

module.exports = router;
