require("dotenv").config();
const request = require("supertest");
const express = require("express");

const prisma = require("../prisma");
const sweetsRoutes = require("../routes/sweets.routes");
const authRoutes = require("../auth/auth.routes");

const app = express();
app.use(express.json());

// register routes
app.use("/api/sweets", sweetsRoutes);
app.use("/auth", authRoutes);

// helper to register + login
async function registerAndLogin(user) {
    await request(app).post("/auth/register").send(user);

    const loginRes = await request(app)
        .post("/auth/login")
        .send({
            username: user.username,
            password: user.password,
        });

    return loginRes.body.token;
}

/**
 * IMPORTANT:
 * Reset DB before EACH test
 * This guarantees clean, predictable tests
 */
beforeEach(async () => {
    await prisma.sweet.deleteMany();
    await prisma.user.deleteMany();

    await prisma.sweet.createMany({
        data: [
            { name: "Gulab Jamun", category: "Indian", price: 10, quantity: 50 },
            { name: "Rasgulla", category: "Indian", price: 12, quantity: 30 },
            { name: "Ladoo", category: "Indian", price: 8, quantity: 100 },
        ],
    });
});

describe("GET /api/sweets", () => {
    it("should return list of sweets", async () => {
        const response = await request(app).get("/api/sweets");

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
    });
});

describe("POST /api/sweets/:id/purchase", () => {
    it("should reduce quantity when purchase is successful", async () => {
        const beforeResponse = await request(app).get("/api/sweets");
        const sweet = beforeResponse.body[0];

        const purchaseResponse = await request(app)
            .post(`/api/sweets/${sweet.id}/purchase`)
            .send({ quantity: 2 });

        expect(purchaseResponse.statusCode).toBe(200);
        expect(purchaseResponse.body.message).toBe("Purchase successful");
        expect(purchaseResponse.body.sweet.quantity).toBe(
            sweet.quantity - 2
        );
    });

    it("should fail if stock is insufficient", async () => {
        const beforeResponse = await request(app).get("/api/sweets");
        const sweet = beforeResponse.body[0];

        const response = await request(app)
            .post(`/api/sweets/${sweet.id}/purchase`)
            .send({ quantity: 10000 });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Insufficient stock");
    });
});

describe("POST /api/sweets/:id/restock", () => {
    it("should increase quantity when restock is successful", async () => {
        const adminToken = await registerAndLogin({
            username: "admin_restock",
            password: "admin123",
            role: "admin",
        });

        const beforeResponse = await request(app).get("/api/sweets");
        const sweet = beforeResponse.body[0];

        const restockResponse = await request(app)
            .post(`/api/sweets/${sweet.id}/restock`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ quantity: 5 });

        expect(restockResponse.statusCode).toBe(200);
        expect(restockResponse.body.message).toBe("Restock successful");
        expect(restockResponse.body.sweet.quantity).toBe(
            sweet.quantity + 5
        );
    });

    it("should fail for invalid restock quantity", async () => {
        const adminToken = await registerAndLogin({
            username: "admin_restock2",
            password: "admin123",
            role: "admin",
        });

        const beforeResponse = await request(app).get("/api/sweets");
        const sweet = beforeResponse.body[0];

        const response = await request(app)
            .post(`/api/sweets/${sweet.id}/restock`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ quantity: 0 });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Invalid restock quantity");
    });
});

describe("DELETE /api/sweets/:id", () => {
    it("should delete a sweet successfully", async () => {
        const adminToken = await registerAndLogin({
            username: "admin_delete",
            password: "admin123",
            role: "admin",
        });

        const beforeResponse = await request(app).get("/api/sweets");
        const sweet = beforeResponse.body[0];

        const deleteResponse = await request(app)
            .delete(`/api/sweets/${sweet.id}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(deleteResponse.statusCode).toBe(200);
        expect(deleteResponse.body.message).toBe("Sweet deleted successfully");
    });

    it("should fail when deleting a non-existent sweet", async () => {
        const adminToken = await registerAndLogin({
            username: "admin_delete2",
            password: "admin123",
            role: "admin",
        });

        const response = await request(app)
            .delete("/api/sweets/99999")
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("Sweet not found");
    });
});

describe("Auth protection for admin routes", () => {
    it("should block access without token", async () => {
        const res = await request(app)
            .post("/api/sweets")
            .send({
                name: "Test Sweet",
                category: "Indian",
                price: 10,
                quantity: 10,
            });

        expect(res.statusCode).toBe(401);
    });

    it("should block non-admin user", async () => {
        const userToken = await registerAndLogin({
            username: "user1",
            password: "user123",
            role: "user",
        });

        const res = await request(app)
            .post("/api/sweets")
            .set("Authorization", `Bearer ${userToken}`)
            .send({
                name: "Test Sweet",
                category: "Indian",
                price: 10,
                quantity: 10,
            });

        expect(res.statusCode).toBe(403);
    });

    it("should allow admin user", async () => {
        const adminToken = await registerAndLogin({
            username: "admin2",
            password: "admin123",
            role: "admin",
        });

        const res = await request(app)
            .post("/api/sweets")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                name: "Admin Sweet",
                category: "Indian",
                price: 20,
                quantity: 5,
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe("Sweet added successfully");
    });
});
