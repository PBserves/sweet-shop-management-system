const express = require("express");

const app = express();
const PORT = 3000;

// route
app.get("/", (req, res) => {
    res.send("Auto restart works 🎉");

});

// start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
