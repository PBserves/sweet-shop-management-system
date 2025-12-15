const prisma = require("../prisma");

// get all sweets
async function getAllSweets() {
    return prisma.sweet.findMany();
}

// add a new sweet
async function addSweet(data) {
    const { name, category, price, quantity } = data;

    if (!name || !category || price <= 0 || quantity < 0) {
        throw new Error("Invalid sweet data");
    }

    return prisma.sweet.create({
        data: {
            name,
            category,
            price,
            quantity,
        },
    });
}

// purchase sweet
async function purchaseSweet(id, quantity) {
    if (quantity <= 0) {
        throw new Error("Invalid purchase quantity");
    }

    const sweet = await prisma.sweet.findUnique({
        where: { id },
    });

    if (!sweet) {
        throw new Error("Sweet not found");
    }

    if (sweet.quantity < quantity) {
        throw new Error("Insufficient stock");
    }

    return prisma.sweet.update({
        where: { id },
        data: {
            quantity: sweet.quantity - quantity,
        },
    });
}

// restock sweet
async function restockSweet(id, quantity) {
    if (quantity <= 0) {
        throw new Error("Invalid restock quantity");
    }

    const sweet = await prisma.sweet.findUnique({
        where: { id },
    });

    if (!sweet) {
        throw new Error("Sweet not found");
    }

    return prisma.sweet.update({
        where: { id },
        data: {
            quantity: {
                increment: quantity,
            },
        },
    });
}

// delete sweet
async function deleteSweet(id) {
    const sweet = await prisma.sweet.findUnique({
        where: { id },
    });

    if (!sweet) {
        throw new Error("Sweet not found");
    }

    await prisma.sweet.delete({
        where: { id },
    });

    return sweet;
}

module.exports = {
    getAllSweets,
    addSweet,
    purchaseSweet,
    restockSweet,
    deleteSweet,
};
