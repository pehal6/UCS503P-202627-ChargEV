const express = require('express');
const router = express.Router();
const Station = require('../models/Station');

// Initial seed data for Patiala
const initialStations = [
    {
        stationId: 'tata-leela',
        name: 'Tata Power EZ Charge',
        location: 'Near Leela Bhawan, Model Town, Patiala',
        googleMapsUrl: 'https://maps.google.com/?q=Tata+Power+EV+Charging+Station+Leela+Bhawan+Patiala',
        connectorType: 'CCS2 Fast DC',
        powerOutput: '150 kW Output',
        totalPorts: 6,
        bookedPorts: 2,
        imageUrl: 'images/tata-power.jpg'
    },
    {
        stationId: 'chargezone-sirhind',
        name: 'ChargeZone Hub',
        location: 'Yashodha Hyundai, Sirhind Road, Patiala',
        googleMapsUrl: 'https://maps.google.com/?q=Yashodha+Hyundai+Sirhind+Road+Patiala',
        connectorType: 'CCS2 & Type 2',
        powerOutput: '60 kW Rapid',
        totalPorts: 4,
        bookedPorts: 2,
        imageUrl: 'images/charge.zone.jpg'
    },
    {
        stationId: 'statiq-nh64',
        name: 'Statiq Charging Station',
        location: 'Gurunanak Petro Mall, NH-64, Patiala',
        googleMapsUrl: 'https://maps.google.com/?q=Gurunanak+Petro+Mall+NH64+Patiala',
        connectorType: 'CCS2 Fast DC',
        powerOutput: '120 kW Fast',
        totalPorts: 4,
        bookedPorts: 3,
        imageUrl: 'images/thunderplus.jpg'
    }
];

// GET all stations (with auto-seeding if collection is empty)
router.get('/', async (req, res) => {
    try {
        let stations = await Station.find();
        if (stations.length === 0) {
            stations = await Station.insertMany(initialStations);
        }
        res.json(stations);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching stations', error: err.message });
    }
});

module.exports = router;