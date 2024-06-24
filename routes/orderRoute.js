const {
     createOrder,
     getUserOrders,
     deleteOrder,
     updateOrderStatus,
} = require("../controllers/orderController");
const { validateToken } = require("../middlewares/validateTokenHandler");
const router = require("express").Router();

// Route to create a new order (requires token validation)
router.post("/", validateToken, createOrder);

// Route to fetch orders for the logged-in user (requires token validation)
router.get("/user-orders", validateToken, getUserOrders);

module.exports = router;
