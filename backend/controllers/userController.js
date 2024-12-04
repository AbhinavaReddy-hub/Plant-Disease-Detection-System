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
//   const { email, password } = req.body;

//   try {
//     // Check if user exists
//     const user = await User.findOne({ email });
//     if (!user) return res.status(401).json({ message: "Invalid email or password" });

//     // Compare passwords
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

//     res.status(200).json({ message: "Login successful", user });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error logging in", error });
//   }
// };

// module.exports = { registerUser, loginUser };
import bcrypt from "bcrypt";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();
import { v4 as uuidv4 } from 'uuid';
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import User from "../models/User.js";
import { env } from "process";

export const signup = async (req, res) => {
	const { email, password, name, location } = req.body;

	try {
		// Check for missing fields
		if (!email || !password || !name || !location) {
			return res.status(400).json({ success: false, message: "All fields are required" });
		}

		// Check if user already exists by email or username
		const userAlreadyExistsByEmail = await User.findOne({ email });
		const userAlreadyExistsByName = await User.findOne({ username: name });

		if (userAlreadyExistsByEmail || userAlreadyExistsByName) {
			return res.status(400).json({ success: false, message: "User already exists" });
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create and save the new user
		const user = new User({
			username: name,
			location,
			email,
			password: hashedPassword,
		});

		await user.save();

		// Generate token and set cookie
		generateTokenAndSetCookie(res, user._id);

		// Respond with success
		res.status(201).json({
			success: true,
			message: "User created successfully",
			user: {
				id: user.user_id,
				email: user.email,
				username: user.username,
				state: user.state,
				district: user.district,
			},
		});
	} catch (error) {
		res.status(500).json({ success: false, message: "Error creating user", error: error.message });
	}
};

export const verifyEmail = async (req, res) => {
	const { code } = req.body;
	try {
		const user = await User.findOne({
			verificationToken: code,
			verificationTokenExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
		}

		user.isVerified = true;
		user.verificationToken = undefined;
		user.verificationTokenExpiresAt = undefined;
		await user.save();

		res.status(200).json({
			success: true,
			message: "Email verified successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		console.log("error in verifyEmail ", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};


export const login = async (req, res) => {
	const { username, password } = req.body;
	try {
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}
		generateTokenAndSetCookie(res, user._id);
		res.status(200).json({
			success: true,
			message: "Logged in successfully",
			user: { ...user._doc, password: undefined },
		});
	} catch (error) {
		console.error("Login Error:", error);  // Log for debugging
		res.status(500).json({ success: false, message: "Login error", error: error.message });
	}

};


export const logout = async (req, res) => {
	res.clearCookie("token");
	res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const forgotPassword = async (req, res) => {
	const { email } = req.body;
	try {
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		// Generate reset token
		const resetToken = crypto.randomBytes(20).toString("hex");
		const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

		user.resetPasswordToken = resetToken;
		user.resetPasswordExpiresAt = resetTokenExpiresAt;

		await user.save();

		// send email

		res.status(200).json({ success: true, message: "Password reset link sent to your email" });
	} catch (error) {
		console.log("Error in forgotPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const resetPassword = async (req, res) => {
	try {
		const { token } = req.params;
		const { password } = req.body;

		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
		}

		// update password
		const hashedPassword = await bcryptjs.hash(password, 10);

		user.password = hashedPassword;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpiresAt = undefined;
		await user.save();


		res.status(200).json({ success: true, message: "Password reset successful" });
	} catch (error) {
		console.log("Error in resetPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const checkAuth = async (req, res) => {
	try {
		// const user = await User.findById(req.userId).select("-password");
		// if (!user) {
		// 	return res.status(400).json({ success: false, message: "User not found" });
		// }
		if (req.isAuthenticated) {
			res.status(200).json({ success: true, user });
		} else {
			res.status(401).json({ message: "Not authenticated" });
		}
	} catch (error) {
		console.log("Error in checkAuth ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};
