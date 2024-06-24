const asyncHandler = require("express-async-handler");
const Products = require("../models/productModel");
const Users = require("../models/userModel");
const slugify = require("slugify");

/**
 * Retrieves all products. All users can access.
 * Supports filtering by 'new' (sort by createdAt descending) and 'category'.
 * @param {Request} req - The request object containing query parameters 'new' and 'category'.
 * @param {Response} res - The response object.
 * @throws {Error} Throws an error if there are issues with fetching products.
 */
getProducts = asyncHandler(async (req, res) => {
     const qNew = req.query.new;
     const qCategory = req.query.category;
     let products;

     if (qNew) {
          products = await Products.find().sort({ createdAt: -1 }).limit(2);
     } else if (qCategory) {
          products = await Products.find({
               categories: {
                    $in: [qCategory],
               },
          });
     } else {
          products = await Products.find();
     }

     if (!products || products.length === 0) {
          res.status(404);
          throw new Error("No Products Found");
     }

     res.status(200).json(products);
});

/**
 * Retrieves a single product by its ID. All users can access.
 * @param {Request} req - The request object containing the product ID in params.
 * @param {Response} res - The response object.
 * @throws {Error} Throws an error if the product is not found.
 */
getProduct = asyncHandler(async (req, res) => {
     const productAvailable = await Products.findById(req.params.id);

     if (!productAvailable) {
          res.status(404);
          throw new Error("Product not found");
     }

     res.status(200).json(productAvailable);
});

/**
 * Creates a new product. Only admin users can access.
 * @param {Request} req - The request object containing product details in body.
 * @param {Response} res - The response object.
 * @throws {Error} Throws an error if user is not an admin or if product creation fails.
 */
createProduct = asyncHandler(async (req, res) => {
     const userId = req.user._id;

     if (!userId) {
          res.status(400);
          throw new Error("No user found");
     }

     const { title, price } = req.body;

     if (!title || !price) {
          res.status(400);
          throw new Error("Title and price are required");
     }

     const slug = slugify(title);

     const productData = {
          ...req.body,
          slug,
          listedBy: userId,
     };

     const product = await Products.create(productData);

     res.status(201).json(product);
});

/**
 * Updates an existing product. Only admin users can access.
 * @param {Request} req - The request object containing product ID in params and updated details in body.
 * @param {Response} res - The response object.
 * @throws {Error} Throws an error if user is not an admin, or if the product is not found, or if update operation fails.
 */
updateProduct = asyncHandler(async (req, res) => {
     const productId = req.params.id;

     if (!productId) {
          res.status(400);
          throw new Error("Invalid product ID");
     }

     const { title } = req.body;

     if (title) {
          req.body.slug = slugify(title);
     }

     const productAvailable = await Products.findById(productId);

     if (!productAvailable) {
          res.status(404);
          throw new Error("Product not found");
     }

     const updatedProduct = await Products.findByIdAndUpdate(
          productId,
          req.body,
          { new: true }
     );

     res.status(200).json(updatedProduct);
});

/**
 * Deletes a product. Only admin users can access.
 * @param {Request} req - The request object containing product ID in params.
 * @param {Response} res - The response object.
 * @throws {Error} Throws an error if user is not an admin, or if the product is not found, or if delete operation fails.
 */
deleteProduct = asyncHandler(async (req, res) => {
     const productId = req.params.id;

     if (!productId) {
          res.status(400);
          throw new Error("Invalid product ID");
     }

     const productAvailable = await Products.findById(productId);

     if (!productAvailable) {
          res.status(404);
          throw new Error("Product not found");
     }

     await Products.findByIdAndDelete(productId);

     res.status(200).json({ message: "Product deleted successfully" });
});

module.exports = {
     getProducts,
     getProduct,
     createProduct,
     updateProduct,
     deleteProduct,
};
