const jwt = require("jsonwebtoken");
const Admin = require("../Models/adminSchema");
const { blacklistedTokens } = require("../Controllers/adminController");

const protectAdmin = async (req, res, next) => {
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
      req.admin = await Admin.findById(decoded.id).select("-passwordHash");

      if (!req.admin) {
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

module.exports = protectAdmin;
