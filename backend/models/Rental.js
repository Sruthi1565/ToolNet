
const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
    toolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tool', 
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    rentalDays: {
        type: Number,
        required: true,
    },
    rentedAt: {
        type: Date,
        default: Date.now,
    },
    cost:{
        type:Number,
        required:true,
    },
});

module.exports = mongoose.model('Rental', rentalSchema);
