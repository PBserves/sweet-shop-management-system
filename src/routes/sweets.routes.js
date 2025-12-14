const express = require("express");
const router = express.Router();

const {
    getAllSweets,
    addSweet,
    purchaseSweet,
    restockSweet,
    deleteSweet,
} = require("../services/sweets.service");

// GET /api/sweets
router.get("/", (req, res) => {
    res.json(getAllSweets());
});

// POST /api/sweets
router.post("/", (req, res) => {
    try {
        const sweet = addSweet(req.body);
        res.status(201).json({
            message: "Sweet added successfully",
            sweet,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// POST /api/sweets/:id/purchase
router.post("/:id/purchase", (req, res) => {
    try {
        const sweet = purchaseSweet(
            parseInt(req.params.id),
            req.body.quantity
        );
        res.json({
            message: "Purchase successful",
            sweet,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// POST /api/sweets/:id/restock
router.post("/:id/restock", (req, res) => {
    try {
        const sweet = restockSweet(
            parseInt(req.params.id),
            req.body.quantity
        );
        res.json({
            message: "Restock successful",
            sweet,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE /api/sweets/:id
router.delete("/:id", (req, res) => {
    try {
        const deletedSweet = deleteSweet(parseInt(req.params.id));
        res.json({
            message: "Sweet deleted successfully",
            sweet: deletedSweet,
        });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});


module.exports = router;
