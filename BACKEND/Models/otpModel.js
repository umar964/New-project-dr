 const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "order",
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60, // auto delete after 1 minutes or 60 seconds
  },
});

module.exports = mongoose.model("Otp", otpSchema);
