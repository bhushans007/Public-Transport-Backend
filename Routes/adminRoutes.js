const express = require("express");
const router = express.Router();
const { loginAdmin, logoutAdmin,updateConductorStatus,getPassengerList, getConductorList} = require("../Controllers/adminController");
// const { addRoute } = require("../Controllers/routeController");
const protectAdmin = require("../Middleware/authMiddlewareAdmin");

// Login Route
router.post("/login", loginAdmin);

// Logout Route
router.post("/logout", logoutAdmin);

// ✅ Admin updates conductor status using user_name
router.put("/update-conductor-status", protectAdmin, updateConductorStatus);

// 🔹 Get Passenger List
router.get("/passenger-list", protectAdmin, getPassengerList);

// 🔹 Get Conductor List
router.get("/conductor-list", protectAdmin, getConductorList);

// // 🔹 Add Route (Admin Only)
// router.post("/addroutes", protectAdmin, addRoute);
module.exports = router;
