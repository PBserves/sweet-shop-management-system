const prisma = require("../prisma");
const AppError = require("../utils/AppError");

// get all sweets
async function getAllSweets() {
    return prisma.sweet.findMany();
}

// add a new sweet
async function addSweet(data) {
    const { name, category, price, quantity } = data;

    if (!name || !category || price <= 0 || quantity < 0) {
        throw new AppError("Invalid sweet data", 400);
    }

    return prisma.sweet.create({
        data: { name, category, price, quantity },
    });
}

// purchase sweet
async function purchaseSweet(id, quantity) {
    if (quantity <= 0) {
        throw new AppError("Invalid purchase quantity", 400);
    }

    const sweet = await prisma.sweet.findUnique({ where: { id } });

    if (!sweet) {
        throw new AppError("Sweet not found", 404);
    }

    if (sweet.quantity < quantity) {
        throw new AppError("Insufficient stock", 400);
    }

    return prisma.sweet.update({
        where: { id },
        data: { quantity: sweet.quantity - quantity },
    });
}

// restock sweet
async function restockSweet(id, quantity) {
    if (quantity <= 0) {
        throw new AppError("Invalid restock quantity", 400);
    }

    const sweet = await prisma.sweet.findUnique({ where: { id } });

    if (!sweet) {
        throw new AppError("Sweet not found", 404);
    }

    return prisma.sweet.update({
        where: { id },
        data: {
            quantity: { increment: quantity },
        },
    });
}

// delete sweet
async function deleteSweet(id) {
    const sweet = await prisma.sweet.findUnique({ where: { id } });

    if (!sweet) {
        throw new AppError("Sweet not found", 404);
    }

    await prisma.sweet.delete({ where: { id } });

    return sweet;
}

module.exports = {
    getAllSweets,
    addSweet,
    purchaseSweet,
    restockSweet,
    deleteSweet,
};
