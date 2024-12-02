const express = require('express');
const multer = require('multer');
const path = require('path');
const { exec } = require('child_process');
const cors = require('cors');
const { MongoClient } = require("mongodb");
const nodemailer = require("nodemailer");
const Queue = require('bull');
const redis = require('redis');

const app = express();
const PORT = 3000;

// MongoDB Atlas connection URI
const uri = "mongodb+srv://avanagantiabhinavreddy:abcd@cluster0.dlygg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

/// Database and collection details
const dbName = "plant_disease_detection";
const collectionDiagnoses = "Diagnoses";
const collectionUsers = "Users";
const collectionLocationAnalysis = "LocationAnalysis";
const THRESHOLD = 3;

// Set up Nodemailer for sending email notifications
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'codingislove003@gmail.com', // replace with your email
    pass: 'shsv vqcs duva ikwj' // replace with your email password or app password
  }
});

// Initialize Bull queue
const emailQueue = new Queue('emailQueue', { redis: { host: '127.0.0.1', port: 6379 } });
// Check Redis connection
const redisClient = redis.createClient({ host: '127.0.0.1', port: 6379 });
redisClient.on('connect', () => console.log('Connected to Redis successfully.'));
redisClient.on('error', (err) => console.error('Redis connection error:', err));
// Function to add emails to the queue
async function queueEmails(users, diseaseName, location, count) {
  users.forEach(user => {
    emailQueue.add({
      to: user.email,
      subject: `Alert: ${diseaseName} Exceeds Threshold in ${location}`,
      text: `Dear ${user.username},\n\nThere are now ${count} cases of ${diseaseName} in ${location}, exceeding the threshold of ${THRESHOLD}.\n\nStay alert and take necessary precautions.\n\nBest regards,\nVriksha Raksha Team`
    });
  });
  console.log(`Queued ${users.length} emails for processing.`);
}
// Email queue worker to process emails
emailQueue.process(async (job) => {
  const { to, subject, text } = job.data;

  // Send email using Nodemailer
  try {
    await transporter.sendMail({
      from: 'codingislove003@gmail.com',
      to,
      subject,
      text,
    });
    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
    throw error;
  }
});
// // Function to send email alerts to all users in the affected location
// async function sendEmailAlertToUsers(diseaseName, location, count) {
//   try {
//     await client.connect();
//     const database = client.db(dbName);
//     const usersCollection = database.collection(collectionUsers);

//     // Fetch all users in the specified location
//     const users = await usersCollection.find({ location: location }).toArray();

//     // Send an email to each user
//     for (const user of users) {
//       const mailOptions = {
//         from: 'codingislove003@gmail.com',
//         to: user.email,
//         subject: `Alert: ${diseaseName} Exceeds Threshold in ${location}`,
//         text: `Dear ${user.username},\n\nThere are now ${count} cases of ${diseaseName} in ${location}, exceeding the threshold of ${THRESHOLD}.\n\nStay alert and take necessary precautions.\n\nBest regards,\nVriksha Raksha  Team`
//       };

//       await transporter.sendMail(mailOptions);
//       console.log(`Email alert sent successfully to ${user.email}.`);
//     }
//   } catch (error) {
//     console.error("Error sending email alerts to users:", error);
//   } finally {
//     await client.close();
//   }
// }

// Function to check disease counts for the current month and send alerts if necessary
async function checkAndAlert(diseaseName, location) {
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const currentYear = new Date().getFullYear();

  try {
    await client.connect();
    const database = client.db(dbName);
    const locationAnalysisCollection = database.collection(collectionLocationAnalysis);
    const usersCollection = database.collection(collectionUsers);
    // Fetch the disease count for the current month and location
    const locationData = await locationAnalysisCollection.findOne({ "_id.location": location });
    if (locationData) {
      const monthData = locationData.summary.find(summary =>
        summary.year === currentYear && summary.month === currentMonth && summary.disease_counts.disease_name === diseaseName
      );

      if (monthData && monthData.disease_counts.count > THRESHOLD) {
        console.log(`ALERT: Disease ${diseaseName} cases in ${location} have exceeded the threshold. Total count: ${monthData.disease_counts.count}`);
        // await sendEmailAlertToUsers(diseaseName, location, monthData.disease_counts.count);
         // Fetch users in the location and queue email alerts
         const users = await usersCollection.find({ location }).toArray();
         await queueEmails(users, diseaseName, location, monthData.disease_counts.count);
      }
    }
  } catch (error) {
    console.error("Error checking and alerting:", error);
  } finally {
    await client.close();
  }
}

// Function to insert diagnosis data into MongoDB
async function insertDiagnosis(diagnosisData, diseaseName, userLocation, temp, res) {
  try {
    await client.connect();
    const database = client.db(dbName);
    const diagnosesCollection = database.collection(collectionDiagnoses);

    // Insert the diagnosis data into the Diagnoses collection
    await diagnosesCollection.insertOne(diagnosisData);
    console.log("Inserted diagnosis data:", diagnosisData);

    // Send success response back to the client
    res.json({
      message: "Diagnosis data stored successfully.",
      data: diagnosisData,
      output: temp
    });

    // Check and send alerts if the threshold is exceeded
    await checkAndAlert(diseaseName, userLocation);
  } catch (dbError) {
    console.error("Database error:", dbError);
    res.status(500).json({ message: "Failed to store diagnosis data.", error: dbError.message });
  } finally {
    await client.close();
  }
}

app.use(cors());
app.use(express.static(path.join(__dirname, '../public')));

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: path.join(__dirname, 'uploads'),
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Serve home.html at the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/home.html'));
});

// Route to handle image upload and classification
app.post('/upload', upload.single('image'), async (req, res) => {
  const imgPath = req.file.path;

  // Execute the Python script for classification with extended timeout (60 seconds)
  exec(`python "${path.join(__dirname, 'classify.py')}" "${imgPath}"`, { encoding: 'utf-8' }, async (error, stdout, stderr) => {
    if (error) {
      console.error(`Error during classification: ${error.message}`);
      console.error(`stderr: ${stderr}`);
      return res.status(500).json({ message: 'Failed to classify the image.', error: stderr });
    }

    // Check if the Python script provided valid output
    const outputLines = stdout.trim().split('\n');
    const temp = stdout.trim();
    if (temp === "Not a leaf") {
      res.json({ output: temp });
    } else {
      // Extract disease name and confidence score
      const diseaseName = outputLines[0].replace("Plant Disease: ", "").trim();
      const confidenceScore = parseFloat(outputLines[1].replace("Confidence Score: ", "").trim());
      const userId = 36; // Example user ID; dynamically provided based on your system's logic

      try {
        await client.connect();
        const database = client.db(dbName);
        const usersCollection = database.collection(collectionUsers);

        // Fetch the user's location based on user_id
        const user = await usersCollection.findOne({ user_id: userId });
        if (!user) {
          return res.status(404).json({ message: "User not found." });
        }
        const userLocation = user.location;

        // Prepare the diagnosis data
        const diagnosisData = {
          disease_name: diseaseName,
          user_id: userId,
          location: userLocation,
          diagnosis_date: new Date(),
          confidence_score: confidenceScore
        };

        // Insert diagnosis and handle alerts
        await insertDiagnosis(diagnosisData, diseaseName, userLocation, temp, res);
      } catch (dbError) {
        console.error("Error during diagnosis insertion:", dbError);
        res.status(500).json({ message: "Failed to process diagnosis data.", error: dbError.message });
      } finally {
        await client.close();
      }
    }
  });
});
// Route to get email queue status
app.get('/queue/status', async (req, res) => {
  try {
    const counts = await emailQueue.getJobCounts();
    res.json(counts);
  } catch (error) {
    console.error("Error fetching queue status:", error);
    res.status(500).json({ message: "Failed to fetch queue status." });
  }
});
// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
