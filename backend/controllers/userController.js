const User = require("../models/User");
const { getNextSequenceValue } = require("../models/counter"); // Import the counter model

// Register a new user
const registerUser = async (req, res) => {
  const { username, email, password, location } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Get the next user_id using the auto-increment logic
    const user_id = await getNextSequenceValue("user_id");

    // Create a new user with the auto-incremented user_id
    const newUser = new User({ user_id, username, email, password, location });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering user", error });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

module.exports = { registerUser, loginUser };
