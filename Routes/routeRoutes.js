const express = require("express");
const router = express.Router();
const { addRoute, fetchAllRoutes } = require("../Controllers/routeController");
const protectAdmin = require("../Middleware/authMiddlewareAdmin");

// 🔹 Admin can add a route
router.post("/addroutes", protectAdmin, addRoute);
router.get("/fetchAllRoutes",fetchAllRoutes)

module.exports = router;
