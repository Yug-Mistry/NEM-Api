const { validateToken } = require("../middlewares/validateTokenHandler");
const router = require("express").Router();
const {
     addItemToCart,
     getCart,
     removeItem,
     deleteCart,
     updateCartItemQuantity,
} = require("../controllers/cartController");

// Route to add an item to the cart
router.post("/", validateToken, addItemToCart);

// Route to get the cart for the logged-in user
router.get("/get-cart", validateToken, getCart);

// Route to remove an item from the cart
router.post("/remove-cart-item", validateToken, removeItem);

// Route to update the quantity of an item in the cart
router.post(
     "/update-cart-item-quantity",
     validateToken,
     updateCartItemQuantity
);

// Route to delete the entire cart for the logged-in user
router.delete("/delete-cart", validateToken, deleteCart);

module.exports = router;
