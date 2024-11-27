const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // For example: 'user_id'
  seq: { type: Number, required: true, default: 0 },
});

const Counter = mongoose.model("Counter", counterSchema);

// Function to get the next sequence value for auto-increment
const getNextSequenceValue = async (name) => {
  const counter = await Counter.findOneAndUpdate(
    { _id: name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
};

module.exports = { getNextSequenceValue };
