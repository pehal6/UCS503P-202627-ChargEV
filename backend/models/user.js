const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, default: '' },
    city: { type: String, default: '' },
    evModel: { type: String, default: '' },
    connectorType: { type: String, default: 'CCS2' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);