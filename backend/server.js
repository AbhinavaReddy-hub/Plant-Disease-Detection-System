
const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const multer = require('multer');
const { exec } = require('child_process');
const redis = require('redis');
const Queue = require('bull');
const DiagnosisRoutes = require('./routes/DiagnosisRoutes');
const bodyParser = require("body-parser");
const analysisRoutes = require("./routes/analysisRoutes");
const HistoryRoutes = require("./routes/HistoryRoutes");
const postRoutes = require("./routes/postRoutes");
const notificationRoutes = require("./routes/NotificationRoutes");
const SolveRoutes = require('./routes/SolveRoutes');
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.urlencoded({ extended: true }));
// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // The frontend origin (change this if necessary)
  credentials: true,  // Allow credentials (cookies, authorization headers, etc.)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],  // Include any additional headers your frontend might send
}));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'uploads')));

// Redis and Bull Queue
const redisClient = redis.createClient({ host: '127.0.0.1', port: 6379 });
redisClient.on('connect', () => console.log('Connected to Redis'));
redisClient.on('error', err => console.error('Redis error:', err));
// app.use(
//   cors({
//       origin: "http://localhost:5173",
//       methods: ["GET", "POST", "PUT", "DELETE"],
//       credentials: true, // If cookies or auth tokens are being used
//   })
// );
const emailQueue = new Queue('emailQueue', { redis: { host: '127.0.0.1', port: 6379 } });
emailQueue.process(async (job) => {
    const { to, subject, text } = job.data;
    const transporter = require('./utils/nodemailerConfig').transporter;
    await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, text });
});

// // MongoDB connection
// mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.error('MongoDB error:', err));
// // MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

// Routes

app.use("/api/users", require("./routes/userRoutes"));
app.use('/api/diagnosis', DiagnosisRoutes);
app.use("/api/analysis", require("./routes/analysisRoutes"));
app.use("/api/history", HistoryRoutes);
app.use("/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);
app.use('/api/solve', SolveRoutes);
// app.use("/api/auth", authRoutes);
// if (process.env.NODE_ENV === "production") {
// 	app.use(express.static(path.join(__dirname, "/frontend/dist")));

// 	app.get("*", (req, res) => {
// 		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
// 	});
// }

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// const express = require("express");
// const cors = require("cors");
// const path = require("path");
// const dotenv = require("dotenv");
// const mongoose = require("mongoose");
// const redis = require("redis");
// const Queue = require("bull");
// const bodyParser = require("body-parser");

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(bodyParser.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, "uploads")));

// // Redis and Bull Queue
// const redisClient = redis.createClient({ url: "redis://127.0.0.1:6379" });

// redisClient
//   .connect()
//   .then(() => console.log("Connected to Redis"))
//   .catch((err) => console.error("Redis connection error:", err));

// const emailQueue = new Queue("emailQueue", {
//   redis: { host: "127.0.0.1", port: 6379 },
// });

// // Email Queue Processing
// emailQueue.process(async (job) => {
//   const { to, subject, text } = job.data;
//   const transporter = require("./utils/nodemailerConfig").transporter;
//   await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, text });
// });

// // MongoDB Connection
// mongoose
//   .connect(process.env.MONGODB_URI)
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err) => console.error("MongoDB connection error:", err));

// // Routes
// const userRoutes = require("./routes/userRoutes");
// const diagnosisRoutes = require("./routes/DiagnosisRoutes");
// const analysisRoutes = require("./routes/analysisRoutes");
// const historyRoutes = require("./routes/HistoryRoutes");
// const postRoutes = require("./routes/postRoutes");
// const notificationRoutes = require("./routes/NotificationRoutes");

// app.use("/api/users", userRoutes);
// app.use("/api/diagnosis", diagnosisRoutes);
// app.use("/api/analysis", analysisRoutes);
// app.use("/api/history", historyRoutes);
// app.use("/posts", postRoutes);
// app.use("/api/notifications", notificationRoutes);

// // Start Server
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });
