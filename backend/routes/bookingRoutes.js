const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Station = require('../models/Station');

router.post('/', async (req, res) => {
    try {
        const newBooking = new Booking(req.body);
        await newBooking.save();

        // Increment booked ports for the station
        const updatedStation = await Station.findOneAndUpdate(
            { stationId: req.body.stationId },
            { $inc: { bookedPorts: 1 } },
            { new: true }
        );

        if (updatedStation) {
            const availablePorts = updatedStation.totalPorts - updatedStation.bookedPorts;
            
            // Broadcast live update to all connected clients
            req.io.emit('port_count_updated', {
                stationId: updatedStation.stationId,
                availablePorts: availablePorts > 0 ? availablePorts : 0
            });
        }

        res.status(201).json({ message: 'Booking successful', booking: newBooking });
    } catch (err) {
        res.status(500).json({ message: 'Booking failed', error: err.message });
    }
});

module.exports = router;