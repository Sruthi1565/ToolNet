const mongoose = require('mongoose');

const toolSchema = new mongoose.Schema({
  owner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String },
  condition: { type: String, required: true },
  location: { type: String, required: true },
  availability: { type: Boolean, default: true },
  rental_price: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  latitude: { type: Number, required: true }, // New field for latitude
  longitude: { type: Number, required: true } // New field for longitude
});

module.exports = mongoose.model('Tool', toolSchema);
