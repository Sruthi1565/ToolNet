const express = require('express');
const router = express.Router();
const Order = require('../models/Order'); // Import your Order model

// GET route to fetch orders for a specific user
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        // Fetching orders for the user without populating Tool details
        const orders = await Order.find({ userId }).exec();

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this user' });
        }

        // Format the response to only include the required fields
        const formattedOrders = orders.map(order => ({
            _id: order._id,
            userId: order.userId,
            cartItems: order.cartItems.map(item => ({
                toolId: item.toolId, // Use the correct field name
                toolName: item.toolName,
                rentalDays: item.rentalDays,
                cost: item.cost,
                toolImage: item.toolImage,
                rentalPrice: item.rentalPrice,
                rentedAt: item.rentedAt
            })),
            address: order.address,
            totalCost: order.totalCost,
            status: order.status,
            createdAt: order.createdAt,
            rentalEndDate: order.rentalEndDate // Include rentalEndDate if needed
        }));

        res.status(200).json(formattedOrders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
