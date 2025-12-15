const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
    const adminPassword = await bcrypt.hash("admin123", 10);

    await prisma.user.upsert({
        where: { username: "admin" },
        update: {},
        create: {
            username: "admin",
            password: adminPassword,
            role: "admin",
        },
    });

    await prisma.sweet.createMany({
        data: [
            {
                name: "Gulab Jamun",
                category: "Indian",
                price: 10,
                quantity: 50,
            },
            {
                name: "Rasgulla",
                category: "Indian",
                price: 12,
                quantity: 30,
            },
            {
                name: "Ladoo",
                category: "Indian",
                price: 8,
                quantity: 100,
            },
        ],
    });

    console.log("Database seeded successfully");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
