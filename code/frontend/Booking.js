// models/Booking.js
const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    bookingId: { type: String, required: true, unique: true },
    stationId: { type: String, required: true },
    connector: { type: String, required: true },
    durationMinutes: { type: Number, required: true },
    timeSlot: { type: String, required: true },
    totalPrice: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', BookingSchema);