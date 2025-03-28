const Route = require("../Models/routeModel");

// 📌 Admin Adds a New Route
const addRoute = async (req, res) => {
    try {
        const { routeId, startingLocation, destination, stops, totalDistanceKm, farePerKm } = req.body;

        // Validate input
        if (!routeId || !startingLocation || !destination || !stops || !totalDistanceKm || !farePerKm) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Check if route ID already exists
        const existingRoute = await Route.findOne({ routeId });
        if (existingRoute) {
            return res.status(400).json({ message: "Route ID already exists." });
        }

        // Create a new route
        const newRoute = new Route({
            routeId,
            startingLocation,
            destination,
            stops,
            totalDistanceKm,
            farePerKm,
            rewardPerKm: 0.1,  // Default reward points per km
        });

        await newRoute.save();

        res.status(201).json({ message: "Route added successfully!", route: newRoute });
    } catch (error) {
        console.error("Error adding route:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

const fetchAllRoutes = async (req, res) => {
    try {
        const routes = await Route.find().select('-routeId'); // Exclude routeId

        if (!routes || routes.length === 0) {
            return res.status(404).json({ message: "No routes found." });
        }

        res.status(200).json({ routes });
    } catch (error) {
        console.error("Error fetching all routes:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
module.exports = { addRoute ,fetchAllRoutes};
