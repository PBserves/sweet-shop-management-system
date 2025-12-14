const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../auth/auth.service");

// Verify user is authenticated
function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1]; // Bearer <token>

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // { id, role }
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}

// Verify user is admin
function requireAdmin(req, res, next) {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
    }
    next();
}

module.exports = {
    requireAuth,
    requireAdmin,
};
