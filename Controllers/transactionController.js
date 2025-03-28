const Transaction = require("../Models/transactionModel");
const Route = require("../Models/routeModel");
const Passenger = require("../Models/passengerSchema");

// 📌 Book Ticket
const bookTicket = async (req, res) => {
    try {
        const { conductorId, user_name, startLocation, destination, pin } = req.body;

        // Validate input
        if (!conductorId || !user_name || !startLocation || !destination || !pin) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Find passenger by user_name
        const passenger = await Passenger.findOne({ user_name });
        if (!passenger) return res.status(404).json({ message: "Passenger not found" });

        // Check PIN authentication
        if (passenger.pin != pin) return res.status(401).json(passenger.pin);

        // Find the route
        const route = await Route.findOne({ "stops.name": startLocation, "stops.name": destination });
        if (!route) return res.status(404).json({ message: "Invalid Route Selection" });

        // Calculate fare, distance, and rewards
        const { distance, fare, rewardPoints } = route.calculateFareTimeRewards(startLocation, destination);

        if (passenger.wallet.balance < fare) {
            return res.status(400).json({ message: "Insufficient wallet balance" });
        }


        // Create transaction record
        const transaction = new Transaction({
            conductorId,
            passengerId: passenger._id,
            passengerName: passenger.user_name,
            user_name,
            routeId: route._id,
            startLocation,
            destination,
            kms: distance,
            fare,
            rewardPoints,
            paymentStatus: "Completed"
        });

        await transaction.save();

        // Update Passenger Rewards
        passenger.wallet.balance -= Number(fare);
        passenger.wallet.rewardPoints += Number(rewardPoints);
        passenger.travelHistory.push({
            transactionId: transaction._id,
            conductorId,
            routeId: route._id,
            startLocation,
            destination,
            kms: distance,
            fare,
            rewardPointsEarned: rewardPoints,
            paymentStatus: "Completed"
        });
        await passenger.save();

        res.status(201).json({
            message: "Ticket booked successfully",
            transaction
        });

    } catch (error) {
        console.error("❌ Error booking ticket:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

module.exports = { bookTicket };
