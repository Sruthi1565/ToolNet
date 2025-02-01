const express = require('express');
const multer = require('multer');
const path = require('path');
const Tool = require('../models/Tool');

const router = express.Router();

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory to store uploaded images
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = fileTypes.test(file.mimetype);

        if (extname && mimeType) {
            cb(null, true);
        } else {
            cb(new Error('Only images (jpeg, jpg, png) are allowed!'));
        }
    }
});

// Add tool route with image upload handling
router.post('/addtool', upload.single('image'), async (req, res) => {
    try {
        const { owner_id, name, description, condition, location, rental_price, category, latitude, longitude } = req.body;

        // Check if an image was uploaded
        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

        const tool = new Tool({
            owner_id,
            name,
            description,
            condition,
            location,
            rental_price,
            category,
            image: imagePath, // Save the image path in the database
            latitude,
            longitude
        });

        await tool.save();
        res.status(201).json(tool);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
