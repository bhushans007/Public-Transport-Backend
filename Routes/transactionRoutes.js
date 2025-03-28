const express = require("express");
const router = express.Router();
const { bookTicket } = require("../Controllers/transactionController");
const protectConductor = require("../Middleware/authMiddlewareConductor");

// 🎫 Book Ticket (Only Conductors)
router.post("/book-ticket", protectConductor, bookTicket);

module.exports = router;
