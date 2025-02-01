const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  profile: {
    bio: {
      type: String,
      default: '',
    },
    profileImage: {
      type: String,  // This will store the base64 string or URL of the image
      default: '',
    },
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;

