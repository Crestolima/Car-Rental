const bookingSchema = new mongoose.Schema({
    car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'completed'], default: 'pending' },
  }, { timestamps: true });
  
  module.exports = mongoose.model('Booking', bookingSchema);
  