const Conductor = require("../Models/conductorSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateToken = require("../Utils/generateToken");

// In-memory token blacklist (for demo purposes)
let blacklistedTokens = [];

/**
 * @desc   Register a new conductor.
 * @note   Registration creates a record with "pending" status.
 *         An admin approval flow (to be implemented later) will activate the account.
 */
const registerConductor = async (req, res) => {
  try {
    console.log("Incoming Request Body:", req.body);
    const { user_name, name, email, phone, password } = req.body;

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new conductor with status "pending"
    const newConductor = new Conductor({
      user_name,
      name,
      email,
      phone,
      passwordHash: hashedPassword,
      status: "pending", // Registration pending admin approval
    });

    await newConductor.save();

    res.status(201).json({
      message: "Conductor registration submitted successfully! Awaiting admin approval.",
      conductor: { id: newConductor._id, user_name, name, email, phone },
    });
  } catch (error) {
    console.error("Error saving to DB:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * @desc   Login a conductor.
 * @note   Only conductors with "active" status can login.
 */
const loginConductor = async (req, res) => {
  try {
    const { user_name, password } = req.body;
    if (!user_name || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const conductor = await Conductor.findOne({ user_name });
    if (!conductor) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Check if the conductor has been approved (active status)
    if (conductor.status !== "active") {
      return res.status(401).json({ message: "Your account is not active. Please wait for admin approval." });
    }

    // Compare the provided password with the stored hash
    const isMatch = await bcrypt.compare(password, conductor.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: conductor._id, user_name: conductor.user_name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Update lastLogin timestamp
    conductor.lastLogin = Date.now();
    await conductor.save();

    res.status(200).json({
      message: "Login successful!",
      token,
      conductor: {
        id: conductor._id,
        user_name: conductor.user_name,
        phone: conductor.phone,
      },
    });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * @desc   Logout a conductor by blacklisting the token.
 */
const logoutConductor = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(400).json({ message: "No valid token provided" });
    }

    const token = authHeader.split(" ")[1];
    blacklistedTokens.push(token);
    return res.status(200).json({ message: "Logout successful!" });
  } catch (error) {
    console.error("Error in logout:", error);
    return res.status(500).json({ message: "Logout Failed", error: error.message });
  }
};

module.exports = { registerConductor, loginConductor, logoutConductor, blacklistedTokens };
