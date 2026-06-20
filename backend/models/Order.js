// models/Order.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  renterEmail: {
    type: String,
    required: true,
  },
  cartItems: [
    {
      toolId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tool', required: true },
      ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      toolName: { type: String, required: true }, // storing name for quick access
      rentalDays: { type: Number, required: true },
      cost: { type: Number, required: true },
      toolImage:{type:String},
      rentalPrice:{type: Number, required: true},
      rentedAt:{type:Date},
      requestStatus: {
        type: String,
        enum: ['requested', 'accepted', 'declined', 'completed'],
        default: 'requested',
      },
      ownerResponseAt: { type: Date },
    }
  ],
  address: {
    type: String,
    required: true,
  },
  totalCost: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['requested', 'active', 'declined', 'completed'],
    default: 'requested',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  rentalEndDate: { type: Date },
});

OrderSchema.pre('save', function(next) {
  if (this.isNew && !this.rentalEndDate && this.cartItems.length > 0) {
      this.rentalEndDate = new Date(this.createdAt);
      const rentalDays = Math.max(...this.cartItems.map((item) => item.rentalDays));
      this.rentalEndDate.setDate(this.rentalEndDate.getDate() + rentalDays);
  }
  next();
});


module.exports = mongoose.model('Order', OrderSchema);
