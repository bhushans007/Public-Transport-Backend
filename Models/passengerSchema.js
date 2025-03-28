const mongoose = require("mongoose");

const passengerSchema = new mongoose.Schema(
  {
    user_name: {
      type: String,
      required: true,
      unique: true, // Unique username
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    pin: {
      type: String,
      required: true
    },
    wallet: {
      balance: {
        type: Number,
        default: 0
      },
      rewardPoints: {
        type: Number,
        default: 0
      }
    },
    travelHistory: [
      {
        transactionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Transaction"
        },
        conductorId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Conductor"
        },
        routeId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Route"
        },
        startLocation: {
          type: String,
          trim: true
        },
        destination: {
          type: String,
          trim: true
        },
        kms: {
          type: Number
        },
        fare: {
          type: Number
        },
        rewardPointsEarned: {
          type: Number
        },
        paymentStatus: {
          type: String,
          enum: ["Completed", "Pending", "Failed"],
          default: "Completed"
        },
        timestamp: {
          type: Date,
          default: Date.now
        }
      }
    ],    
    redemptionHistory: [
      {
        rewardId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Reward"
        },
        fundGenerated: {
          type: String,
          trim: true
        },
        pointsUsed: {
          type: Number
        },
        timestamp: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  {
    timestamps: true // Automatically manages `createdAt` and `updatedAt`
  }
);
// module.exports = mongoose.model("Passenger", passengerSchema);
module.exports = mongoose.models.Passenger || mongoose.model("Passenger", passengerSchema);

