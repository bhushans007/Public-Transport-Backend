const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    user_name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.models.Admin || mongoose.model("Admin", adminSchema, "admins"); // Using "admins" collection
