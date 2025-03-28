const mongoose = require("mongoose");

const conductorSchema = new mongoose.Schema(
  {
    user_name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    busDetails: {
      busNumber: { type: String, trim: true },
      routeId: { type: String, trim: true },
      routeName: { type: String, trim: true },
    },
    assignedTrips: [
      {
        tripId: String,
        startTime: Date,
        endTime: Date,
        passengerCount: Number,
        totalFareCollected: Number,
      },
    ],
    transactions: [
      {
        transactionId: String,
        passengerId: String,
        ticketId: String,
        fare: Number,
        distance: Number,
        rewardPoints: Number,
        timestamp: Date,
      },
    ],
    lastLogin: Date,
    // New registrations are set to "pending" until approved by admin.
    status: { type: String, enum: ["pending", "active", "inactive"], default: "pending" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Conductor || mongoose.model("Conductor", conductorSchema);
