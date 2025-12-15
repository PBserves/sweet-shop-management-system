const AppError = require("../utils/AppError");

module.exports = (err, req, res, next) => {
    // Default values
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Something went wrong";

    // Prisma: record not found
    if (err.code === "P2025") {
        err = new AppError("Sweet not found", 404);
    }

    // Prisma: unique constraint failed
    if (err.code === "P2002") {
        err = new AppError("Duplicate entry", 400);
    }

    // JWT errors
    if (err.name === "JsonWebTokenError") {
        err = new AppError("Invalid token", 401);
    }

    if (err.name === "TokenExpiredError") {
        err = new AppError("Token expired", 401);
    }

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
};
