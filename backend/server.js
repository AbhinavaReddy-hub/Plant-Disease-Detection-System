// const express = require("express");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const bodyParser = require("body-parser");

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());
// app.use(express.json()); // Added for modern JSON handling (doesn't conflict with bodyParser)
// // MongoDB Connection
// mongoose
//   .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err) => console.log("MongoDB Connection Error:", err));

// // Routes
// app.use("/api/users", require("./routes/userRoutes"));
// app.use("/api/diagnosis", require("./routes/diagnosisRoutes")); // New route for image classification
// // Start the server
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const multer = require('multer');
// const { exec } = require('child_process');
// const redis = require('redis');
// const Queue = require('bull');
// const DiagnosisRoutes = require('./routes/DiagnosisRoutes');
const bodyParser = require("body-parser");
// const notificationRoutes = require('./routes/notificationRoutes');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'uploads')));

// Redis and Bull Queue
// const redisClient = redis.createClient({ host: '127.0.0.1', port: 6379 });
// redisClient.on('connect', () => console.log('Connected to Redis'));
// redisClient.on('error', err => console.error('Redis error:', err));

// const emailQueue = new Queue('emailQueue', { redis: { host: '127.0.0.1', port: 6379 } });
// emailQueue.process(async (job) => {
//     const { to, subject, text } = job.data;
//     const transporter = require('./utils/nodemailerConfig').transporter;
//     await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, text });
// });

// // MongoDB connection
// mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.error('MongoDB error:', err));
// // MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 10000, // Set a timeout for server selection
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("MongoDB Connection Error:", err));


// Routes
app.use("/api/users", require("./routes/userRoutes"));
// app.use('/api/diagnosis', DiagnosisRoutes);
// app.use('/api/notifications', notificationRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
