
const express = require('express');
const router = express.Router();
const Rental = require('../models/Rental'); // Import your Rental model
const Tool = require('../models/Tool'); // Import your Tool model
const { check, validationResult } = require('express-validator');

// POST route to rent a tool
router.post('/rent', [
    check('toolId').not().isEmpty().withMessage('Tool ID is required'),
    check('userId').not().isEmpty().withMessage('User ID is required'),
    check('rentalDays').isInt({ gt: 0 }).withMessage('Rental days must be greater than zero')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { toolId, userId, rentalDays } = req.body;

    try {
        // Fetch the tool to calculate the cost
        const tool = await Tool.findById(toolId);
        if (!tool) return res.status(404).send('Tool not found');

        // Check if a rental for this tool and user already exists
        let rental = await Rental.findOne({ toolId, userId });
        if (rental) {
            // If rental exists, update the rental days and cost
            rental.rentalDays += rentalDays;
            rental.cost = tool.rental_price * rental.rentalDays;
            await rental.save();
            res.status(200).json({ message: 'Rental updated successfully', rental });
        } else {
            // If rental does not exist, create a new rental entry
            const cost = tool.rental_price * rentalDays; // Calculate the cost
            rental = new Rental({ toolId, userId, rentalDays, cost });
            await rental.save();
            res.status(201).json({ message: 'Tool rented successfully', rental });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// PUT route to update rental days
router.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { rentalDays } = req.body;

    if (!rentalDays || rentalDays <= 0) {
        return res.status(400).json({ message: 'Rental days must be greater than zero' });
    }

    try {
        const rental = await Rental.findById(id).populate('toolId');
        if (!rental) return res.status(404).send('Rental not found');

        const tool = (rental.toolId);
        if (!tool) return res.status(404).send('Tool not found');

        rental.rentalDays = rentalDays;
        rental.cost = tool.rental_price * rentalDays; // Recalculate cost

        await rental.save();
        res.status(200).json({ message: 'Rental updated successfully', rental });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// DELETE route to remove a rental
router.delete('/remove/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const rental = await Rental.findByIdAndDelete(id);
        if (!rental) return res.status(404).send('Rental not found');

        res.status(200).json({ message: 'Rental removed from cart' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET route to fetch rentals for a user
router.get('/cart/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const rentals = await Rental.find({ userId }).populate('toolId');
        const simplifiedRentals = rentals.map(rental => ({
            _id: rental._id,
            cost: rental.cost,
            rentalDays: rental.rentalDays,
            toolId: rental.toolId._id,
            toolName: rental.toolId.name,
            toolImage:rental.toolId.image,
            rentalPrice:rental.toolId.rental_price,
            rentedAt:rental.rentedAt,
        }));
        res.status(200).json(simplifiedRentals);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
