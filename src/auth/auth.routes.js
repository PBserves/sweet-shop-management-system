const express = require("express");
const router = express.Router();

const {
    registerUser,
    loginUser,
} = require("./auth.service");

// POST /auth/register
router.post("/register", async (req, res) => {
    try {
        const user = await registerUser(req.body);
        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// POST /auth/login
router.post("/login", async (req, res) => {
    try {
        const token = await loginUser(req.body);
        res.json({ token });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
