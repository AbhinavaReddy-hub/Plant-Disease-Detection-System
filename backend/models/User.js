const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    user_id: { type: Number, required: true, unique: true }, // Ensure user_id is unique
    username: { type: String, required: true },
    location: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    user_type: { type: String, default:"normal"},
  },
  {
    collection: "Users", // Specify the collection name explicitly
  }
);

module.exports = mongoose.model("User", userSchema);
