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
const Tool = require('../models/Tool');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  logger: true,
  debug: true,
});

// Function to get the tool owner's details
async function getToolOwnerInfo(toolId) {
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

    return {
      email: tool.owner_id.email,
      ownerId: tool.owner_id._id,
      tool,
    };
  } catch (error) {
    console.error('Error fetching tool owner details:', error);
    return null;
  }
}

// Checkout route
router.post('/checkout', async (req, res) => {
  const { userId, cartItems, address, userEmail } = req.body;

  try {
      const enrichedCartItems = await Promise.all(cartItems.map(async (item) => {
          const ownerInfo = await getToolOwnerInfo(item.toolId);

          if (!ownerInfo) {
              throw new Error(`Unable to find owner for ${item.toolName}`);
          }

          return {
              ...item,
              ownerId: ownerInfo.ownerId,
              requestStatus: 'requested',
              ownerEmail: ownerInfo.email,
          };
      }));

      // Calculate total cost of the order
      const totalCost = enrichedCartItems.reduce((total, item) => total + item.cost, 0);

      // Create a new order
      const newOrder = new Order({
          userId,
          renterEmail: userEmail,
          cartItems: enrichedCartItems.map(({ ownerEmail, ...item }) => item),
          address,
          totalCost,
          status: 'requested',
          createdAt: new Date(),
      });

      // Calculate the rental end date based on rental days from cartItems
      if (enrichedCartItems.length > 0) {
          const rentalDays = Math.max(...enrichedCartItems.map((item) => item.rentalDays));
          newOrder.rentalEndDate = new Date();
          newOrder.rentalEndDate.setDate(newOrder.rentalEndDate.getDate() + rentalDays);
      }

      // Save the new order to the database
      await newOrder.save();

    // Email to customer
    const customerMailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'ToolNet Rental Request Submitted',
      text: `Dear Customer,
    
    Your rental request has been submitted successfully. The tool owner will review the request and coordinate delivery or handoff details with you.
    
    Request Summary:
    ${enrichedCartItems
      .map(
        (item, index) => `
    ${index + 1}. Tool Name: ${item.toolName}
       Rental Days: ${item.rentalDays}
       Cost: ₹${item.cost}`
      )
      .join('\n')}
    
    Total Cost: ₹${totalCost}
    
    Delivery Address: ${address}
    
    Thank you for choosing ToolNet!
    
    Best regards,
    Your ToolNet Team`,
    };
    
    await transporter.sendMail(customerMailOptions);

    // Loop through each item to notify each tool owner and delete the tool
    for (const item of enrichedCartItems) {
      if (item.ownerEmail) {
        const ownerMailOptions = {
          from: process.env.EMAIL_USER,
          to: item.ownerEmail,
          subject: 'ToolNet Rental Request - Please Coordinate Delivery',
          text: `Hello, 

${userEmail} has requested to rent your tool "${item.toolName}".

Order Details:
Tool Name: ${item.toolName}
Rental Days: ${item.rentalDays}
Cost: ₹${item.cost}
Total Rental Cost: ₹${totalCost}
Delivery Address: ${address}

Please contact the renter at ${userEmail} to coordinate the delivery or handoff details. If you are still willing to lend this tool, confirm availability, agree on the delivery timing, and complete the handoff safely.

Once the rental is complete, make sure both sides have agreed on the return plan and tool condition.

Thank you,
Your ToolNet Team`,
        };
        await transporter.sendMail(ownerMailOptions);
      }

      // Hide the tool from browse while the owner reviews the request.
      await Tool.findByIdAndUpdate(item.toolId, { availability: false });
    }

    res.status(201).json({ message: 'Rental request submitted successfully', order: newOrder });
  } catch (error) {
    console.error('Error details:', error);
    res.status(500).json({ message: 'Checkout failed', error: error.message });
  }
});

module.exports = router;
