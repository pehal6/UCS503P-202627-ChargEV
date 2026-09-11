const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    stationName: { type: String, required: true },
    date: { type: String, required: true },
    timeSlot: { type: String, required: true },
    vehicleType: { type: String, required: true },
    amount: { type: Number, default: 350.00 },
    status: { type: String, default: 'Confirmed' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);