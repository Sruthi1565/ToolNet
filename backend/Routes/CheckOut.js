require('dotenv').config();
console.log('dotenv loaded:', !!process.env.EMAIL_USER && !!process.env.EMAIL_PASS);

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error('Error: EMAIL_USER or EMAIL_PASS is not defined in .env file');
  process.exit(1); 
}

console.log("Environment variables loaded successfully.");

const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Order = require('../models/Order');
const Tool = require('../models/Tool'); // Assuming Tool and User models are properly set up
const User = require('../models/User');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  logger: true,
  debug: true,
});

// Function to get the tool owner's email
async function getToolOwnerEmail(toolId) {
  try {
    const tool = await Tool.findById(toolId).populate('owner_id');
    
    if (!tool) {
        console.log(`Tool with ID ${toolId} not found.`);
        return null;
    }
    
    if (!tool.owner_id) {
        console.log(`Owner for tool with ID ${toolId} not found.`);
        return null;
    }

    return tool.owner_id.email;
  } catch (error) {
    console.error('Error fetching tool owner email:', error);
    return null;
  }
}

// Checkout route
router.post('/checkout', async (req, res) => {
  const { userId, cartItems, address, userEmail } = req.body;

  try {
      // Calculate total cost of the order
      const totalCost = cartItems.reduce((total, item) => total + item.cost, 0);

      // Create a new order
      const newOrder = new Order({
          userId,
          cartItems,
          address,
          totalCost,
          status: 'Pending',
          createdAt: new Date(),
      });

      // Calculate the rental end date based on rental days from cartItems
      if (cartItems.length > 0) {
          const rentalDays = cartItems.reduce((totalDays, item) => totalDays + item.rentalDays, 0);
          newOrder.rentalEndDate = new Date();
          newOrder.rentalEndDate.setDate(newOrder.rentalEndDate.getDate() + rentalDays);
      }

      // Save the new order to the database
      await newOrder.save();

    // Email to customer
    const customerMailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'Order Confirmation',
      text: `Dear Customer,
    
    Your order has been placed successfully! Here are your order details:
    
    Order Summary:
    ${cartItems
      .map(
        (item, index) => `
    ${index + 1}. Tool Name: ${item.toolName}
       Rental Days: ${item.rentalDays}
       Cost: ₹${item.cost}`
      )
      .join('\n')}
    
    Total Cost: ₹${totalCost}
    
    Delivery Address: ${address}
    
    Thank you for choosing our service!
    
    Best regards,
    Your ToolNet Team`,
    };
    
    await transporter.sendMail(customerMailOptions);

    // Loop through each item to notify each tool owner and delete the tool
    for (const item of cartItems) {
      const ownerEmail = await getToolOwnerEmail(item.toolId);
      if (ownerEmail) {
        const ownerMailOptions = {
          from: process.env.EMAIL_USER,
          to: ownerEmail,
          subject: 'Tool Rented Notification',
          text: `Hello, 

${userEmail} has rented your tool "${item.toolName}". 

Order Details:
Tool Name: ${item.toolName}
Cost: ₹${item.cost}
Total Rental Cost: ₹${totalCost}
Delivery Address: ${address}

Thank you,
Your ToolNet Team`,
        };
        await transporter.sendMail(ownerMailOptions);
      }

      // Delete the tool from the database
      await Tool.findByIdAndDelete(item.toolId);
    }

    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (error) {
    console.error('Error details:', error);
    res.status(500).json({ message: 'Checkout failed', error: error.message });
  }
});

module.exports = router;
