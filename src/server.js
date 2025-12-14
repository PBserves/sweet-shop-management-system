const express = require("express");

const app = express();
const PORT = 3000;
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


// start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
