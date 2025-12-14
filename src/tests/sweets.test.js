const request = require("supertest");
const express = require("express");

const sweetsRoutes = require("../routes/sweets.routes");

const app = express();
app.use(express.json());
app.use("/api/sweets", sweetsRoutes);

describe("GET /api/sweets", () => {
    it("should return list of sweets", async () => {
        const response = await request(app).get("/api/sweets");

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});

describe("POST /api/sweets/:id/purchase", () => {
    it("should reduce quantity when purchase is successful", async () => {
        // First, get current sweets
        const beforeResponse = await request(app).get("/api/sweets");
        const sweet = beforeResponse.body[0]; // take first sweet
        const originalQuantity = sweet.quantity;

        // Purchase 2 units
        const purchaseResponse = await request(app)
            .post(`/api/sweets/${sweet.id}/purchase`)
            .send({ quantity: 2 });

        expect(purchaseResponse.statusCode).toBe(200);
        expect(purchaseResponse.body.message).toBe("Purchase successful");
        expect(purchaseResponse.body.sweet.quantity).toBe(
            originalQuantity - 2
        );
    });

    it("should fail if stock is insufficient", async () => {
        // Try to purchase an absurdly large quantity
        const response = await request(app)
            .post("/api/sweets/1/purchase")
            .send({ quantity: 10000 });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Insufficient stock");
    });
});

describe("POST /api/sweets/:id/restock", () => {
    it("should increase quantity when restock is successful", async () => {
        // Get current quantity
        const beforeResponse = await request(app).get("/api/sweets");
        const sweet = beforeResponse.body[0];
        const originalQuantity = sweet.quantity;

        // Restock 5 units
        const restockResponse = await request(app)
            .post(`/api/sweets/${sweet.id}/restock`)
            .send({ quantity: 5 });

        expect(restockResponse.statusCode).toBe(200);
        expect(restockResponse.body.message).toBe("Restock successful");
        expect(restockResponse.body.sweet.quantity).toBe(
            originalQuantity + 5
        );
    });

    it("should fail for invalid restock quantity", async () => {
        const response = await request(app)
            .post("/api/sweets/1/restock")
            .send({ quantity: 0 });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Invalid restock quantity");
    });
});

describe("DELETE /api/sweets/:id", () => {
    it("should delete a sweet successfully", async () => {
        // Get current sweets
        const beforeResponse = await request(app).get("/api/sweets");
        const sweetsBefore = beforeResponse.body;
        const sweetToDelete = sweetsBefore[0];

        // Delete the sweet
        const deleteResponse = await request(app).delete(
            `/api/sweets/${sweetToDelete.id}`
        );

        expect(deleteResponse.statusCode).toBe(200);
        expect(deleteResponse.body.message).toBe("Sweet deleted successfully");

        // Verify it is removed
        const afterResponse = await request(app).get("/api/sweets");
        const sweetsAfter = afterResponse.body;

        const exists = sweetsAfter.find(
            (s) => s.id === sweetToDelete.id
        );
        expect(exists).toBeUndefined();
    });

    it("should fail when deleting a non-existent sweet", async () => {
        const response = await request(app).delete("/api/sweets/99999");

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("Sweet not found");
    });
});
