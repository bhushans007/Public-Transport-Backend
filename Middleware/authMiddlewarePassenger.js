const jwt = require("jsonwebtoken");
const Passenger = require("../Models/passengerSchema");
const { blacklistedTokens } = require("../Controllers/passengerController");

const protectPassenger = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    try {
        token = req.headers.authorization.replace("Bearer ", "").trim();

      // Check if token is blacklisted
      if (blacklistedTokens.includes(token)) {
        return res.status(401).json({ message: "Session Expired! Please Login Again." });
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.passenger = await Passenger.findById(decoded.id).select("-passwordHash");

      if (!req.passenger) {
        return res.status(401).json({ message: "User not found, authorization denied" });
      }

      next();
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        return res.status(401).json({ message: "Not authorized, invalid token", error: error.message });
      }
      
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = protectPassenger;
