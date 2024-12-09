// const bcrypt = require("bcrypt"); // Add bcrypt for password hashing
// const User = require("../models/User");
// const { getNextSequenceValue } = require("../models/counter"); // Import counter model

// // Register a new user
// const registerUser = async (req, res) => {
//   const { username, email, password, location } = req.body;

//   try {
//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) return res.status(400).json({ message: "User already exists" });

//     // Get the next user_id using the auto-increment logic
//     const user_id = await getNextSequenceValue("user_id");

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create a new user
//     const newUser = new User({
//       user_id,
//       username,
//       email,
//       password: hashedPassword,
//       location,
//     });
//     await newUser.save();

//     res.status(201).json({ message: "User registered successfully", user: newUser });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error registering user", error });
//   }
// };

// // Login user
// const loginUser = async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     // Check if user exists
//     const user = await User.findOne({ username });
//     if (!user) return res.status(401).json({ message: "Invalid username or password" });

//     // Compare passwords
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

//     res.status(200).json({ message: "Login successful", user: { user_id: user.user_id, username: user.username, location: user.location } });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error logging in", error });
//   }
// };

// module.exports = { registerUser, loginUser };

require("dotenv").config(); // Load environment variables
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { getNextSequenceValue } = require("../models/counter");

// Load secret from environment variable
const JWT_SECRET = process.env.JWT_SECRET || "your_default_jwt_secret";

// Register a new user
const registerUser = async (req, res) => {
  const { username, email, password, location } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Get the next user_id using the auto-increment logic
    const user_id = await getNextSequenceValue("user_id");

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      user_id,
      username,
      email,
      password: hashedPassword,
      location
    });
    await newUser.save();

    // Generate JWT token after user registration
    const token = jwt.sign(
      { user_id: newUser.user_id, username: newUser.username},
      JWT_SECRET,
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    // Respond with success message, token, and user data
    res.status(201).json({
      message: "User registered successfully",
      token, // Send the JWT token
      user: { user_id: newUser.user_id, username: newUser.username, location: newUser.location ,user_type:newUser.user_type},
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering user", error });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { user_id: user.user_id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: { user_id: user.user_id, username: user.username, location: user.location,user_type:user.user_type },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in", error });
  }
};

module.exports = { registerUser, loginUser };




