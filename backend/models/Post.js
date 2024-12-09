const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  username: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: Buffer },
  imageType: { type: String },
  createdAt: { type: Date, default: Date.now },
  likes: { type: [String], default: [] },
});

module.exports = mongoose.model("Post", postSchema);
