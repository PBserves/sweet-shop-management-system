// In-memory sweets data
const sweets = [
    { id: 1, name: "Gulab Jamun", price: 10, quantity: 50 },
    { id: 2, name: "Rasgulla", price: 12, quantity: 30 },
    { id: 3, name: "Ladoo", price: 8, quantity: 100 },
];

// get all sweets
function getAllSweets() {
    return sweets;
}

// add a new sweet
function addSweet({ name, price, quantity }) {
    if (!name || !price || !quantity) {
        throw new Error("name, price and quantity are required");
    }

    const newSweet = {
        id: sweets.length + 1,
        name,
        price,
        quantity,
    };

    sweets.push(newSweet);
    return newSweet;
}

// purchase sweet
function purchaseSweet(id, quantity) {
    const sweet = sweets.find((s) => s.id === id);

    if (!sweet) {
        throw new Error("Sweet not found");
    }

    if (quantity <= 0) {
        throw new Error("Invalid purchase quantity");
    }

    if (sweet.quantity < quantity) {
        throw new Error("Insufficient stock");
    }

    sweet.quantity -= quantity;
    return sweet;
}

// restock sweet
function restockSweet(id, quantity) {
    const sweet = sweets.find((s) => s.id === id);

    if (!sweet) {
        throw new Error("Sweet not found");
    }

    if (quantity <= 0) {
        throw new Error("Invalid restock quantity");
    }

    sweet.quantity += quantity;
    return sweet;
}

// delete sweet
function deleteSweet(id) {
    const index = sweets.findIndex((s) => s.id === id);

    if (index === -1) {
        throw new Error("Sweet not found");
    }

    const deletedSweet = sweets[index];
    sweets.splice(index, 1);

    return deletedSweet;
}


module.exports = {
    getAllSweets,
    addSweet,
    purchaseSweet,
    restockSweet,
    deleteSweet,
};
