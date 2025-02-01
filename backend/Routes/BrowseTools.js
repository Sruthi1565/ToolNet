const express = require('express');
const router = express.Router();
const Tool = require('../models/Tool'); 

// Function to calculate the distance between two points using the Haversine formula
const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
};

// Route to get neighborhood tools based on user's location
router.get('/browsetools', async (req, res) => {
    try {
        const userLatitude = parseFloat(req.query.latitude);
        const userLongitude = parseFloat(req.query.longitude);
        const proximity = 10; // 10 km proximity

        const tools = await Tool.find();

        // Filter tools by distance
        const neighborhoodTools = tools.filter(tool => {
            const toolLatitude = tool.latitude; // Assuming 'latitude' field is present in the Tool model
            const toolLongitude = tool.longitude; // Assuming 'longitude' field is present in the Tool model
            const distance = getDistance(userLatitude, userLongitude, toolLatitude, toolLongitude);
            return distance <= proximity; // Return tools within the specified proximity
        });

        if (neighborhoodTools.length === 0) {
            return res.status(404).json({ message: 'No tools found in your neighborhood' });
        }
        
        res.json(neighborhoodTools); 
    } catch (error) {
        console.error("Error fetching tools:", error);
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;
