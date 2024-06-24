const mongoose = require("mongoose");

/**
 * Connects to the MongoDB database using Mongoose.
 * @param {Request} req - The request object (not used in this function).
 * @param {Response} res - The response object (not used in this function).
 */
const connectDb = async (req, res) => {
     try {
          const connect = await mongoose.connect(process.env.MONGO_URL);
          console.log(`Connected to MongoDB: ${connect.connection.name}`);
     } catch (error) {
          console.error("MongoDB connection error:", error);
     }
};

module.exports = connectDb;
