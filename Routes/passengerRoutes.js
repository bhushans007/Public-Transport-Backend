const express = require("express");
const Passenger = require("../Models/passengerSchema");
const { registerPassenger, loginPassenger,logoutPassenger,addFunds,redeemRewards,dashboard,getRedemptionHistory } = require("../Controllers/passengerController");
const bcrypt = require("bcryptjs");
const protectPassenger= require("../Middleware/authMiddlewarePassenger")
//const express = require("express");
const router = express.Router();
const app = express();

app.use(express.json());


router.post("/register", registerPassenger);
router.post("/login", loginPassenger);
router.post("/logout", logoutPassenger);
router.post("/add-funds",protectPassenger,  addFunds);
router.post("/redeem-rewards", protectPassenger, redeemRewards);
router.post("/redeem-history", protectPassenger, getRedemptionHistory);
//router.get("/dashboard", dashboard);


module.exports = router;
