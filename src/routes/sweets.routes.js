const express = require("express");
const router = express.Router();
const {
    requireAuth,
    requireAdmin,
} = require("../middleware/auth.middleware");
const asyncHandler = require("../utils/asyncHandler");
const {
    getAllSweets,
    addSweet,
    purchaseSweet,
    restockSweet,
    deleteSweet,
} = require("../services/sweets.service");

/**
 * @swagger
 * /api/sweets:
 *   get:
 *     summary: Get all sweets
 *     description: Fetch the list of all sweets in inventory
 *     responses:
 *       200:
 *         description: List of sweets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   category:
 *                     type: string
 *                   price:
 *                     type: integer
 *                   quantity:
 *                     type: integer
 */

// GET /api/sweets
router.get(
    "/",
    asyncHandler(async (req, res) => {
        const sweets = await getAllSweets();
        res.json(sweets);
    })
);

/**
 * @swagger
 * /api/sweets:
 *   post:
 *     summary: Add a new sweet (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - price
 *               - quantity
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               price:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Sweet added successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

// POST /api/sweets
router.post(
    "/",
    requireAuth,
    requireAdmin,
    asyncHandler(async (req, res) => {
        const sweet = await addSweet(req.body);
        res.status(201).json({
            message: "Sweet added successfully",
            sweet,
        });
    })
);

/**
 * @swagger
 * /api/sweets/{id}/purchase:
 *   post:
 *     summary: Purchase a sweet
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Purchase successful
 *       400:
 *         description: Insufficient stock
 */


// POST /api/sweets/:id/purchase
router.post(
    "/:id/purchase",
    asyncHandler(async (req, res) => {
        const sweet = await purchaseSweet(
            parseInt(req.params.id),
            req.body.quantity
        );

        res.json({
            message: "Purchase successful",
            sweet,
        });
    })
);

/**
 * @swagger
 * /api/sweets/{id}/restock:
 *   post:
 *     summary: Restock a sweet (Admin only)
 *     description: Increase the quantity of an existing sweet. Only admins can perform this action.
 *     tags:
 *       - Sweets
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the sweet to restock
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       200:
 *         description: Restock successful
 *       400:
 *         description: Invalid restock quantity
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */


// POST /api/sweets/:id/restock
router.post(
    "/:id/restock",
    requireAuth,
    requireAdmin,
    asyncHandler(async (req, res) => {
        const sweet = await restockSweet(
            parseInt(req.params.id),
            req.body.quantity
        );

        res.json({
            message: "Restock successful",
            sweet,
        });
    })
);

/**
 * @swagger
 * /api/sweets/{id}:
 *   delete:
 *     summary: Delete a sweet (Admin only)
 *     description: Permanently delete a sweet from inventory. Only admins can perform this action.
 *     tags:
 *       - Sweets
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the sweet to delete
 *     responses:
 *       200:
 *         description: Sweet deleted successfully
 *       404:
 *         description: Sweet not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */


// DELETE /api/sweets/:id (admin only)
router.delete(
    "/:id",
    requireAuth,
    requireAdmin,
    asyncHandler(async (req, res) => {
        const deletedSweet = await deleteSweet(parseInt(req.params.id));

        res.json({
            message: "Sweet deleted successfully",
            sweet: deletedSweet,
        });
    })
);



module.exports = router;
