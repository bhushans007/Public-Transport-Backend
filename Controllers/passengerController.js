const Passenger = require("../Models/passengerSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateToken = require("../Utils/generateToken");

// 📌 Register Passenger
const registerPassenger = async (req, res) => {
    try {
      console.log("📥 Incoming Request Body:", req.body);
  
      const { user_name, name, email, phone, password,pin } = req.body;
  
      // Hash the password before saving
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create new passenger
      const newPassenger = new Passenger({
        user_name,
        name,
        email,
        phone,
        passwordHash: hashedPassword,
        pin,
      });
  
      await newPassenger.save();
  
      res.status(201).json({
        message: "Passenger registered successfully! Please Login",
        // passenger: { id: newPassenger._id, user_name, name, email, phone},
        // token: generateToken(newPassenger._id),
      });
    } catch (error) {
      console.error("❌ Error Saving to DB:", error);
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  };
  

// 📌 Login Passenger
const loginPassenger = async (req, res) => {
    try {
        const { user_name, password } = req.body; // Extract `user_name` and `passwordHash`

        // Validate inputs
        if (!user_name || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        // Find passenger by `user_name`
        const passenger = await Passenger.findOne({ user_name });
        if (!passenger) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        // Ensure `passenger.passwordHash` exists
        if (!passenger.passwordHash) {
            return res.status(500).json({ message: "User has no password stored" });
        }

        // Compare entered passwordHash with stored hashed password
        const isMatch = await bcrypt.compare(password, passenger.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { id: passenger._id, user_name: passenger.user_name },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            message: "Login successful!",
            token,
            id: passenger._id,
            user_name: passenger.user_name,
            name: passenger.name,
            email: passenger.email,
            phone: passenger.phone,
            balance: passenger.wallet.balance,
            rewardPoints: passenger.wallet.rewardPoints
        });
        

    } catch (error) {
        console.error("❌ Error in login:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// 📌 Add Funds
const addFunds = async (req, res) => {
    try {
        const { user_name, amount } = req.body;
      //  const amount1=Number(amount)
        if (!user_name || amount <= 0) {
            return res.status(400).json({ message: "Invalid request" });
        }
        
        const passenger = await Passenger.findOne({ user_name });
        if (!passenger) {
            return res.status(404).json({ message: "Passenger not found" });
        }
        
        passenger.wallet.balance += Number(amount);
        await passenger.save();
        res.status(200).json({ message: `₹${amount} added!`, balance: passenger.wallet.balance });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// 📌 Redeem Reward Points
const redeemRewards = async (req, res) => {
    try {
        const { user_name, rewardPointsToRedeem } = req.body;
        if (!user_name || rewardPointsToRedeem % 100 !== 0) {
            return res.status(400).json({ message: "Invalid reward redemption request" });
        }
        
        const passenger = await Passenger.findOne({ user_name });
        if (!passenger || passenger.wallet.rewardPoints < rewardPointsToRedeem) {
            return res.status(400).json({ message: "Insufficient reward points" });
        }
        const fundGenerated = Number((rewardPointsToRedeem / 100) * 10)
        passenger.wallet.rewardPoints -= rewardPointsToRedeem;
        passenger.wallet.balance += fundGenerated;
        passenger.redemptionHistory.push({
            rewardId: req.body.rewardId, // Ensure this is a valid ObjectId
            fundGenerated: fundGenerated.toString(), // Convert to string as per schema
            pointsUsed: rewardPointsToRedeem,
            timestamp: new Date()
        });
        await passenger.save();
        
        res.status(200).json({ message: "Rewards redeemed!", balance: passenger.wallet.balance, rewardPoints: passenger.wallet.rewardPoints });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

const getRedemptionHistory = async (req, res) => {
    try {
        const { user_name } = req.body; // Assuming user_name is passed in the URL

        const passenger = await Passenger.findOne({ user_name }).select("redemptionHistory");

        if (!passenger) {
            return res.status(404).json({ message: "Passenger not found" });
        }

        res.status(200).json({ redemptionHistory: passenger.redemptionHistory });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
const dashboard= async (req, res) => {
    try {
        const user = await Passenger.findById(req.user.id);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        res.json({
          message: "Login successful!",
          token: req.token,
          id: user._id,
          user_name: user.user_name,
          name: user.name,
          email: user.email,
          phone: user.phone,
          balance: user.balance,
          rewardPoints: user.rewardPoints,
        });
      } catch (error) {
        res.status(500).json({ message: "Server error" });
      }
    }


// 🔴 LOGOUT PASSENGER
let blacklistedTokens = []; // Temporary storage for invalidated tokens

const logoutPassenger = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(400).json({ message: "No valid token provided" });
        }

        const token = authHeader.split(" ")[1];
        blacklistedTokens.push(token); // Add token to blacklist

        return res.status(200).json({ message: "Logout successful!" });
    } catch (error) {
        console.error("❌ Error in logout:", error);
        return res.status(500).json({ message: "Logout Failed", error: error.message });
    }
};



module.exports = { registerPassenger, loginPassenger,logoutPassenger,redeemRewards,addFunds,getRedemptionHistory,dashboard,blacklistedTokens};
