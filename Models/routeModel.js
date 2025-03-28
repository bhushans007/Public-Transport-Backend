const mongoose = require('mongoose');

const stopSchema = new mongoose.Schema({
    name: { type: String, required: true },
    coordinates: { type: { lat: Number, lng: Number }},
    distanceFromStart: { type: Number, required: true },
    arrivalTime: { type: String},
    departureTime: { type: String }
});

const routeSchema = new mongoose.Schema({
    routeId: { type: String, required: true, unique: true },
    startingLocation: { type: String, required: true },
    destination: { type: String, required: true },
    stops: { type: [stopSchema], required: true },
    totalDistanceKm: { type: Number, required: true },
    farePerKm: { type: Number, required: true },
    rewardPerKm: { type: Number, default: 0.1 },
    active: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

// Method to Calculate Fare, Time & Reward Points
routeSchema.methods.calculateFareTimeRewards = function (fromStop, toStop) {
    const stopFrom = this.stops.find(stop => stop.name === fromStop);
    const stopTo = this.stops.find(stop => stop.name === toStop);

    if (!stopFrom || !stopTo) {
        throw new Error("Invalid stops provided.");
    }

    const distance = Math.abs(stopTo.distanceFromStart - stopFrom.distanceFromStart);
    const fare = distance * this.farePerKm;
    const rewardPoints = distance * this.rewardPerKm;

    return {
        distance,
        fare,
        rewardPoints,
        departureTimeFromSource: stopFrom.departureTime,
        arrivalTimeAtDestination: stopTo.arrivalTime
    };
};

module.exports = mongoose.model('Route', routeSchema);
