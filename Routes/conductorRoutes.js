const express = require("express");
const router = express.Router();
const { registerConductor, loginConductor, logoutConductor } = require("../Controllers/conductorController");

// Registration route
router.post("/register", registerConductor);

// Login route
router.post("/login", loginConductor);

// Logout route
router.post("/logout", logoutConductor);

module.exports = router;
