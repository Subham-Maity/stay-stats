const mongoose = require("mongoose");

let Schema = mongoose.Schema;

const leadSchema = new mongoose.Schema(
  {
    guestName: {
      type: String,
      required: true,
    },
    checkInDate: {
      type: Date,
      required: true,
    },
    checkOutDate: {
      type: Date,
      required: true,
    },
    numberOfPerson: {
      type: String,
      required: true,
    },
    numberOfRooms: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    area: {
      type: String,
      required: true,
    },
    budget: {
      type: String,
      required: true,
    },
    specialRequirements: {
      type: String,
    },
    status: { type: String, enum: ["CONFIRMED", "PENDING"], default: "PENDING" },
    isCancelled: { type: Boolean, default: false },
    serialNumber: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Leads = mongoose.model("leads", leadSchema);

module.exports = {
  Leads,
};
