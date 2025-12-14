const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// in-memory users (temporary)
const users = [];

// SECRET (later move to .env)
const JWT_SECRET = "supersecretkey";

// register user
async function registerUser({ username, password, role }) {
    if (!username || !password) {
        throw new Error("Username and password required");
    }

    const existingUser = users.find((u) => u.username === username);
    if (existingUser) {
        throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
        id: users.length + 1,
        username,
        password: hashedPassword,
        role: role || "user", // default role
    };

    users.push(user);
    return user;
}

// login user
async function loginUser({ username, password }) {
    const user = users.find((u) => u.username === username);
    if (!user) {
        throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
        { id: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: "1h" }
    );

    return token;
}

module.exports = {
    registerUser,
    loginUser,
    JWT_SECRET,
};
