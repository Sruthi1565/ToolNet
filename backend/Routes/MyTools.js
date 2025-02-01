// In your tools route file (e.g., tools.js)
const express = require('express');
const router = express.Router();
const Tool = require('../models/Tool'); // Adjust the path as needed

// Route to get tools by owner_id
router.get('/tools', async (req, res) => {
    const { owner_id } = req.query;

    try {
        const tools = await Tool.find({ owner_id });
        res.json(tools);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
