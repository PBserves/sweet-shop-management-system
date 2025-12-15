const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
require("dotenv").config();
const express = require("express");
const authRoutes = require("./auth/auth.routes");
const globalErrorHandler = require("./middleware/error.middleware");

const app = express();
const PORT = process.env.PORT || 3000;
// middleware
app.use(express.json());


// route
app.get("/", (req, res) => {
    res.send("Auto restart works 🎉");

});
// import sweets routes
const sweetsRoutes = require("./routes/sweets.routes");

// connect sweets routes
app.use("/api/sweets", sweetsRoutes);

app.use("/auth", authRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(globalErrorHandler);

// start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
