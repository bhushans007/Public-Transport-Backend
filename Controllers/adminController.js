const Admin = require("../Models/adminSchema");
const Conductor = require("../Models/conductorSchema");
const Passenger = require("../Models/passengerSchema")
const Route = require("../Models/routeModel");


const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateToken = require("../Utils/generateToken");

// Temporary in-memory blacklist for logout
let blacklistedTokens = [];

// 📌 Admin Login
const loginAdmin = async (req, res) => {
  try {
    const { user_name, password } = req.body;
    
    // Validate input
    if (!user_name || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // Find admin in DB
    const admin = await Admin.findOne({ user_name });
    if (!admin) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Generate JWT Token
    const token = generateToken(admin._id);

    res.status(200).json({
      message: "Login successful!",
      token,
      admin: {
        id: admin._id,
        user_name: admin.user_name
      }
    });

  } catch (error) {
    console.error("❌ Error in admin login:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// 📌 Admin Logout
const logoutAdmin = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(400).json({ message: "No valid token provided" });
    }

    const token = authHeader.split(" ")[1];
    blacklistedTokens.push(token); // Blacklist token

    return res.status(200).json({ message: "Logout successful!" });
  } catch (error) {
    console.error("❌ Error in logout:", error);
    return res.status(500).json({ message: "Logout Failed", error: error.message });
  }
};

// ✅ Admin updates conductor status using user_name
const updateConductorStatus = async (req, res) => {
    try {
      const { user_name, status } = req.body;
  
      // Validate input
      if (!user_name || !status) {
        return res.status(400).json({ message: "Username and status are required." });
      }
  
      // Allowed statuses: ["pending", "active", "inactive"]
      const validStatuses = ["pending", "active", "inactive"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status. Allowed values: pending, active, inactive." });
      }
  
      // Find conductor by user_name
      const conductor = await Conductor.findOne({ user_name });
      if (!conductor) {
        return res.status(404).json({ message: "Conductor not found." });
      }
  
      // Update status
      conductor.status = status;
      await conductor.save();
  
      res.status(200).json({
        message: `Conductor '${user_name}' status updated to '${status}' successfully.`,
        conductor: {
          user_name: conductor.user_name,
          status: conductor.status,
        },
      });
    } catch (error) {
      console.error("Error updating conductor status:", error);
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  };

 // ✅ Get Passenger List
const getPassengerList = async (req, res) => {
    try {
        const passengers = await Passenger.find({}, "user_name name email phone wallet.rewardPoints");

        res.status(200).json({
            message: "Passenger List Retrieved Successfully",
            passengers
        });
    } catch (error) {
        console.error("Error fetching passenger list:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// ✅ Get Conductor List
const getConductorList = async (req, res) => {
    try {
        const conductors = await Conductor.find({}, "user_name name email phone status");

        res.status(200).json({
            message: "Conductor List Retrieved Successfully",
            conductors
        });
    } catch (error) {
        console.error("Error fetching conductor list:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


module.exports = { loginAdmin, logoutAdmin,updateConductorStatus, getPassengerList, getConductorList,blacklistedTokens };
