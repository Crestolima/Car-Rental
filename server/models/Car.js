const mongoose = require('mongoose'); // Import Mongoose first

const carSchema = new mongoose.Schema({
    brand: { type: String, required: true },
    model: { type: String, required: true },
    registrationNumber: { type: String, required: true, unique: true },
    seatingCapacity: { type: Number, required: true },
    pricePerDay: { type: Number, required: true },
    availability: { type: String, enum: ['available', 'rented', 'maintenance'], default: 'available' },
    images: [String],
  }, { timestamps: true });
  
  module.exports = mongoose.model('Car', carSchema); 