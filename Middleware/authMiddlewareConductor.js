const jwt = require("jsonwebtoken");
const Conductor = require("../Models/conductorSchema");
const { blacklistedTokens } = require("../Controllers/conductorController");

const protectConductor = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Check if token is blacklisted
      if (blacklistedTokens.includes(token)) {
        return res.status(401).json({ message: "Session Expired! Please Login Again." });
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.conductor = await Conductor.findById(decoded.id).select("-passwordHash");

      if (!req.conductor) {
        return res.status(401).json({ message: "User not found, authorization denied" });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, invalid token" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = protectConductor;
