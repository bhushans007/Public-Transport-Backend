const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    conductorId: { type: mongoose.Schema.Types.ObjectId, ref: "Conductor", required: true },
    passengerId: { type: mongoose.Schema.Types.ObjectId, ref: "Passenger", required: true },
    routeId: { type: mongoose.Schema.Types.ObjectId, ref: "Route", required: true },
    startLocation: { type: String, required: true },
    destination: { type: String, required: true },
    kms: { type: Number, required: true },
    fare: { type: Number, required: true },
    rewardPoints: { type: Number, required: true },
    paymentStatus: { type: String, enum: ["Pending", "Completed"], default: "Pending" },
    timestamp: { type: Date, default: Date.now }
});


module.exports = mongoose.model("Transaction", transactionSchema);
