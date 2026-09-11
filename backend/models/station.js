const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
    stationId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    location: { type: String, required: true },
    googleMapsUrl: { type: String, required: true },
    connectorType: { type: String, required: true },
    powerOutput: { type: String, required: true },
    totalPorts: { type: Number, required: true },
    bookedPorts: { type: Number, default: 0 },
    imageUrl: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Station', stationSchema);