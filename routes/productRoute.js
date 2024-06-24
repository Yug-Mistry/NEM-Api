const {
     getProducts,
     getProduct,
     createProduct,
     updateProduct,
     deleteProduct,
} = require("../controllers/productController");
const {
     validateToken,
     validateTokenAndAuth,
     AdminAuth,
} = require("../middlewares/validateTokenHandler");
const router = require("express").Router();

// Route to fetch all products (public access)
router.get("/", getProducts);

// Route to fetch a single product by ID (public access)
router.get("/get/:id", getProduct);

// Route to create a new product (requires admin authentication)
router.post("/", AdminAuth, createProduct);

// Route to update a product by ID (requires admin authentication)
router.put("/:id", AdminAuth, updateProduct);

// Route to delete a product by ID (requires admin authentication)
router.delete("/:id", AdminAuth, deleteProduct);

module.exports = router;
