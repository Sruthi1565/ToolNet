// models/Order.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  cartItems: [
    {
      toolId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tool', required: true },
      toolName: { type: String, required: true }, // storing name for quick access
      rentalDays: { type: Number, required: true },
      cost: { type: Number, required: true },
      toolImage:{type:String},
      rentalPrice:{type: Number, required: true},
      rentedAt:{type:Date}
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
  status: { type: String, default: 'active' },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  rentalEndDate: { type: Date },
});

OrderSchema.pre('save', function(next) {
  if (this.isNew) {
      this.rentalEndDate = new Date(this.createdAt);
      this.rentalEndDate.setDate(this.rentalEndDate.getDate() + this.cartItems[0].rentalDays);
  }
  next();
});


module.exports = mongoose.model('Order', OrderSchema);
