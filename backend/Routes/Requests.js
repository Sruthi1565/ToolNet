const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Tool = require('../models/Tool');

const REQUEST_STATUSES = ['requested', 'accepted', 'declined', 'completed'];

const deriveOrderStatus = (items) => {
  const statuses = items.map((item) => item.requestStatus || 'requested');

  if (statuses.length > 0 && statuses.every((status) => status === 'completed')) {
    return 'completed';
  }

  if (statuses.length > 0 && statuses.every((status) => status === 'declined')) {
    return 'declined';
  }

  if (statuses.some((status) => status === 'accepted' || status === 'completed')) {
    return 'active';
  }

  return 'requested';
};

router.get('/:ownerId', async (req, res) => {
  const { ownerId } = req.params;

  try {
    const orders = await Order.find({ 'cartItems.ownerId': ownerId })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .exec();

    const requests = orders.flatMap((order) => (
      order.cartItems
        .filter((item) => item.ownerId?.toString() === ownerId)
        .map((item) => ({
          orderId: order._id,
          requestId: item._id,
          toolId: item.toolId,
          toolName: item.toolName,
          toolImage: item.toolImage,
          rentalDays: item.rentalDays,
          cost: item.cost,
          status: item.requestStatus || 'requested',
          ownerResponseAt: item.ownerResponseAt,
          renterName: order.userId?.name || 'ToolNet renter',
          renterEmail: order.renterEmail || order.userId?.email,
          address: order.address,
          orderCreatedAt: order.createdAt,
          rentalEndDate: order.rentalEndDate,
        }))
    ));

    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching owner requests:', error);
    res.status(500).json({ message: 'Failed to fetch rental requests' });
  }
});

router.patch('/:orderId/items/:itemId/status', async (req, res) => {
  const { orderId, itemId } = req.params;
  const { ownerId, status } = req.body;

  if (!REQUEST_STATUSES.includes(status)) {
    return res.status(400).json({ message: 'Invalid request status' });
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const item = order.cartItems.id(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Request item not found' });
    }

    if (ownerId && item.ownerId?.toString() !== ownerId) {
      return res.status(403).json({ message: 'You can only update requests for your own tools' });
    }

    item.requestStatus = status;
    item.ownerResponseAt = new Date();
    order.status = deriveOrderStatus(order.cartItems);

    await order.save();

    if (status === 'accepted') {
      await Tool.findByIdAndUpdate(item.toolId, { availability: false });
    }

    if (status === 'declined' || status === 'completed') {
      await Tool.findByIdAndUpdate(item.toolId, { availability: true });
    }

    res.status(200).json({
      message: 'Request status updated',
      request: {
        orderId: order._id,
        requestId: item._id,
        status: item.requestStatus,
        ownerResponseAt: item.ownerResponseAt,
      },
    });
  } catch (error) {
    console.error('Error updating owner request:', error);
    res.status(500).json({ message: 'Failed to update request status' });
  }
});

module.exports = router;
