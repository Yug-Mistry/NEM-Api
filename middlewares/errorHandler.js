// Middleware function to handle requests for routes that are not found.
// It creates an Error object with a message indicating the original URL that was not found.
const notFound = (req, res, next) => {
     const error = new Error(`Not Found: ${req.originalUrl}`);
     res.status(404); // Set the HTTP status code to 404
     next(error); // Pass the error to the next middleware function
};

// Middleware function to handle errors thrown by other middleware or route handlers.
// It checks the response's status code; if it's 200 (OK), it sets it to 500 (Internal Server Error).
// Then it sends a JSON response with the error message and stack trace (if available).
const errorHandler = (err, req, res, next) => {
     const statusCode = res.statusCode == 200 ? 500 : res.statusCode; // Determine the HTTP status code
     res.status(statusCode); // Set the HTTP status code
     res.json({ msg: err?.message, stack: err?.stack }); // Send JSON response with error details
};

module.exports = { notFound, errorHandler };
