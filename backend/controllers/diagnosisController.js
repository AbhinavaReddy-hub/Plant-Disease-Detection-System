const path = require('path'); 
const multer = require('multer');
const { exec } = require('child_process');
const Diagnosis = require('../models/Diagnosis');
const User = require('../models/User');
const { checkAndAlert } = require('../utils/checkAndAlert');
const { v2: cloudinary } = require('cloudinary');
const { MongoClient, ObjectId } = require('mongodb');
const Report = require('../models/Report');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data'); 
// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dowliahd4',
  api_key: '274311197456743',
  api_secret: 'ROU_e8IL2N4Ktpsy-xRcPXJIRfA',
});

// Setup storage for file uploads
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage }).single('image');

// MongoDB connection
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const uploadDiagnosis = (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(500).json({ message: 'Image upload failed', error: err.message });

    const filePath = req.file.path;

    try {
      // Step 1: Upload Image to Cloudinary
      const cloudinaryResult = await cloudinary.uploader.upload(filePath, { folder: 'diagnoses' });
      const imageUrl = cloudinaryResult.secure_url;

      // Step 2: Send Image to FastAPI for Classification
      const fastApiUrl = 'http://localhost:8000/classify'; // Adjust based on your server
      const formData = new FormData();
      formData.append('file', fs.createReadStream(filePath));

      const apiResponse = await axios.post(fastApiUrl, formData, {
        headers: formData.getHeaders(),
      });

      const { disease_name: diseaseName, confidence_score: confidenceScore, output } = apiResponse.data;

      // Step 3: Handle Non-Leaf Response
      if (output === 'Not a leaf') return res.json({ output: 'Not a leaf' });

      // Step 4: Fetch User Details
      const userId = req.body.user_id || 40; // Replace 40 with your logic for fetching user ID
      const user = await User.findOne({ user_id: userId });
      if (!user) return res.status(404).json({ message: 'User not found.' });

      // Step 5: Save Diagnosis to MongoDB
      const diagnosis = new Diagnosis({
        disease_name: diseaseName,
        user_id: userId,
        location: user.location,
        diagnosis_date: new Date(),
        confidence_score: confidenceScore,
        image_url: imageUrl,
      });
      const savedDiagnosis = await diagnosis.save();
      await checkAndAlert(diseaseName, user.location);
      // Step 6: Query Disease Information
      await client.connect();
      const db = client.db('plant_disease_detection');
      const collection = db.collection('diseaseinfos');
      const diseaseInfo = await collection.findOne({ [diseaseName]: { $exists: true } });
      if (!diseaseInfo) return res.status(404).json({ message: 'Disease information not found in the database.' });

      // Step 7: Return Response
      res.json({
        message: 'Diagnosis stored successfully',
        diagnosisId: savedDiagnosis._id,
        output: `Disease Name: ${diseaseName}, Confidence Score: ${confidenceScore}`,
        diagnosis,
        disease_info: diseaseInfo[diseaseName],
      });
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json({ message: 'Failed to classify and process image', error: error.message });
    } finally {
      // Clean up local files and close DB connection
      fs.unlinkSync(filePath);
      await client.close();
    }
  });
};
// Report Diagnosis Logic
const reportDiagnosis = async (req, res) => {
  const { diagnosisId, comment } = req.body; // Removed conflicting 'diagnosis'
  console.log("abhi is if", diagnosisId)
  console.log('Request body:', req.body);

  // Check if diagnosisId is provided
  if (!diagnosisId) {
    return res.status(400).json({ message: 'Diagnosis ID is required.' });
  }

  // Validate diagnosisId format
  if (!ObjectId.isValid(diagnosisId)) {
    return res.status(400).json({ message: 'Invalid diagnosis ID format.' });
  }

  try {
    // Find the corresponding diagnosis
    const foundDiagnosis = await Diagnosis.findById(diagnosisId);
    if (!foundDiagnosis) {
      return res.status(404).json({ message: 'Diagnosis not found.' });
    }

    // Create a new report
    const report = new Report({
      diagnosisId,
      comment,
    });

    await report.save();

    // Mark the diagnosis as reported
    const updatedDiagnosis = await Diagnosis.findByIdAndUpdate(
      diagnosisId,
      { reported: true },
      { new: true } // Return the updated document
    );

    res.json({
      message: 'Report submitted successfully',
      report,
      updatedDiagnosis,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit the report', error: error.message });
  }
};
module.exports = { uploadDiagnosis, reportDiagnosis };
// const path = require('path'); 
// const multer = require('multer');
// const { exec } = require('child_process');
// const Diagnosis = require('../models/Diagnosis');
// const User = require('../models/User');
// const { checkAndAlert } = require('../utils/checkAndAlert');
// const { v2: cloudinary } = require('cloudinary');
// const { MongoClient, ObjectId } = require('mongodb');
// const Report = require('../models/Report');
// const fs = require('fs');
// const axios = require('axios');
// // const multer = require('multer');
// // const path = require('path');
// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: 'dowliahd4',
//   api_key: '274311197456743',
//   api_secret: 'ROU_e8IL2N4Ktpsy-xRcPXJIRfA',
// });

// // Setup storage for file uploads
// const storage = multer.diskStorage({
//   destination: 'uploads/',
//   filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
// });
// const upload = multer({ storage }).single('image');

// // MongoDB connection
// const uri = process.env.MONGODB_URI;
// const client = new MongoClient(uri);

// // const uploadDiagnosis = (req, res) => {
// //   upload(req, res, async (err) => {
// //     if (err) return res.status(500).json({ message: 'Image upload failed', error: err });

// //     const filePath = req.file.path;

// //     try {
// //       // Upload image to Cloudinary
// //       const result = await cloudinary.uploader.upload(filePath, { folder: 'diagnoses' });
// //       const imageUrl = result.secure_url;

// //       exec(`python "${path.join(__dirname, '../classify.py')}" "${req.file.path}"`, async (error, stdout) => {
// //         if (error) return res.status(500).json({ message: 'Failed to classify image', error: error.message });

// //         const lines = stdout.trim().split('\n');
// //         if (lines[0] === 'Not a leaf') return res.json({ output: 'Not a leaf' });

// //         const parsedData = JSON.parse(lines[0]);
// //         const diseaseName = parsedData.disease_name;
// //         const confidenceScore = parseFloat(parsedData.confidence_score);
// //         const userId = 40; // Replace this with actual user ID logic

// //         try {
// //           // Fetch user location from DB
// //           const user = await User.findOne({ user_id: userId });
// //           if (!user) return res.status(404).json({ message: 'User not found.' });
          
// //           const diagnosis = new Diagnosis({
// //             disease_name: diseaseName,
// //             user_id: userId,
// //             location: user.location,
// //             diagnosis_date: new Date(),
// //             confidence_score: confidenceScore,
// //             image_url: imageUrl,
// //           });
// //           const savedDiagnosis = await diagnosis.save();
// //           await checkAndAlert(diseaseName, user.location);

// //           // Query the diseaseinfos collection
// //           await client.connect();
// //           const db = client.db("plant_disease_detection");
// //           const collection = db.collection("diseaseinfos");
// //           const diseaseInfo = await collection.findOne({ [diseaseName]: { $exists: true } });

// //           if (!diseaseInfo) {
// //             return res.status(404).json({ message: 'Disease information not found in the database.' });
// //           }
// //           console.log(savedDiagnosis._id);
// //           const newId = new ObjectId(savedDiagnosis._id);
// //           console.log(newId);
          
// //           res.json({
// //             message: 'Diagnosis stored',
// //             diagnosisId: savedDiagnosis._id, // Return the Diagnosis ID
// //             output: `Disease Name: ${diseaseName}, Confidence Score: ${confidenceScore}`,
// //             diagnosis,
// //             disease_info: diseaseInfo[diseaseName],
// //           });
// //         } catch (dbError) {
// //           res.status(500).json({ message: 'Failed to save diagnosis or fetch disease info', error: dbError.message });
// //         } finally {
// //           await client.close();
// //         }
// //       });
// //     } catch (uploadError) {
// //       console.error('Cloudinary Upload Error:', uploadError);
// //       res.status(500).json({ message: 'Failed to upload image to Cloudinary', error: uploadError.message });
// //     }
// //   });
// // };

// // Classify Image Function
// const classifyImage = async (filePath) => {
//   try {
//     const formData = new FormData();
//     formData.append('file', fs.createReadStream(filePath));

//     const response = await axios.post('http://localhost:8000/classify', formData, {
//       headers: { ...formData.getHeaders() },
//     });

//     return response.data;
//   } catch (error) {
//     throw new Error(error.response?.data?.detail || 'Failed to classify image');
//   }
// };

// // Upload Diagnosis Function
// const uploadDiagnosis = (req, res) => {
//   upload(req, res, async (err) => {
//     if (err) return res.status(500).json({ message: 'Image upload failed', error: err });

//     const filePath = req.file.path;

//     try {
//       const result = await classifyImage(filePath);

//       // Handle the classification result
//       if (result.output === 'Not a leaf') {
//         res.json({ output: 'Not a leaf' });
//       } else {
//         const { disease_name, confidence_score } = result;

//         // Save diagnosis data (dummy logic, replace with your DB logic)
//         const diagnosisData = {
//           disease_name,
//           confidence_score,
//           image_path: filePath,
//           diagnosis_date: new Date(),
//         };

//         // Respond with the result
//         res.json({
//           message: 'Diagnosis completed',
//           data: diagnosisData,
//           output: result.output,
//         });
//       }
//     } catch (error) {
//       res.status(500).json({ message: 'Classification failed', error: error.message });
//     } finally {
//       // Delete the uploaded file
//       fs.unlink(filePath, (err) => {
//         if (err) console.error('Failed to delete temporary file:', err);
//       });
//     }
//   });
// };
// // Report Diagnosis Logic
// const reportDiagnosis = async (req, res) => {
//   const { diagnosisId, comment } = req.body; // Removed conflicting 'diagnosis'
//   console.log("abhi is if", diagnosisId)
//   console.log('Request body:', req.body);

//   // Check if diagnosisId is provided
//   if (!diagnosisId) {
//     return res.status(400).json({ message: 'Diagnosis ID is required.' });
//   }

//   // Validate diagnosisId format
//   if (!ObjectId.isValid(diagnosisId)) {
//     return res.status(400).json({ message: 'Invalid diagnosis ID format.' });
//   }

//   try {
//     // Find the corresponding diagnosis
//     const foundDiagnosis = await Diagnosis.findById(diagnosisId);
//     if (!foundDiagnosis) {
//       return res.status(404).json({ message: 'Diagnosis not found.' });
//     }

//     // Create a new report
//     const report = new Report({
//       diagnosisId,
//       comment,
//     });

//     await report.save();

//     // Mark the diagnosis as reported
//     const updatedDiagnosis = await Diagnosis.findByIdAndUpdate(
//       diagnosisId,
//       { reported: true },
//       { new: true } // Return the updated document
//     );

//     res.json({
//       message: 'Report submitted successfully',
//       report,
//       updatedDiagnosis,
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to submit the report', error: error.message });
//   }
// };



// module.exports = { uploadDiagnosis, reportDiagnosis };

// const path = require('path'); 
// const multer = require('multer');
// const { exec } = require('child_process');
// const Diagnosis = require('../models/Diagnosis');
// const User = require('../models/User');
// const { checkAndAlert } = require('../utils/checkAndAlert');
// const { v2: cloudinary } = require('cloudinary');
// const { MongoClient, ObjectId } = require('mongodb');
// const Report = require('../models/Report');
// const fs = require('fs');
// const axios = require('axios');
// const FormData = require('form-data'); 
// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: 'dowliahd4',
//   api_key: '274311197456743',
//   api_secret: 'ROU_e8IL2N4Ktpsy-xRcPXJIRfA',
// });

// // Setup storage for file uploads
// const storage = multer.diskStorage({
//   destination: 'uploads/',
//   filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
// });
// const upload = multer({ storage }).single('image');

// // MongoDB connection
// const uri = process.env.MONGODB_URI;
// const client = new MongoClient(uri);
// // Upload Diagnosis Function
// // Upload Diagnosis Function
// const uploadDiagnosis = (req, res) => {
//   upload(req, res, async (err) => {
//     if (err) return res.status(500).json({ message: 'Image upload failed', error: err.message });

//     const filePath = req.file.path;

//     try {
//       // Step 1: Upload Image to Cloudinary
//       const cloudinaryResult = await cloudinary.uploader.upload(filePath, { folder: 'diagnoses' });
//       const imageUrl = cloudinaryResult.secure_url;

//       // Step 2: Send Image to FastAPI for Classification
//       const fastApiUrl = 'http://localhost:8000/classify'; // Adjust based on your server
//       const formData = new FormData();
//       formData.append('file', fs.createReadStream(filePath));

//       const apiResponse = await axios.post(fastApiUrl, formData, {
//         headers: formData.getHeaders(),
//       });

//       const { disease_name: diseaseName, confidence_score: confidenceScore, output } = apiResponse.data;

//       // Step 3: Handle Non-Leaf Response
//       if (output === 'Not a leaf') return res.json({ output: 'Not a leaf' });

//       // Step 4: Fetch User Details
//       const userId = req.body.user_id || 40; // Replace 40 with your logic for fetching user ID
//       const user = await User.findOne({ user_id: userId });
//       if (!user) return res.status(404).json({ message: 'User not found.' });

//       // Step 5: Save Diagnosis to MongoDB
//       const diagnosis = new Diagnosis({
//         disease_name: diseaseName,
//         user_id: userId,
//         location: user.location,
//         diagnosis_date: new Date(),
//         confidence_score: confidenceScore,
//         image_url: imageUrl,
//       });
//       const savedDiagnosis = await diagnosis.save();
//       await checkAndAlert(diseaseName, user.location);
//       // Step 6: Query Disease Information
//       await client.connect();
//       const db = client.db('plant_disease_detection');
//       const collection = db.collection('diseaseinfos');
//       const diseaseInfo = await collection.findOne({ [diseaseName]: { $exists: true } });
//       if (!diseaseInfo) return res.status(404).json({ message: 'Disease information not found in the database.' });

//       // Step 7: Return Response
//       res.json({
//         message: 'Diagnosis stored successfully',
//         diagnosisId: savedDiagnosis._id,
//         output: `Disease Name: ${diseaseName}, Confidence Score: ${confidenceScore}`,
//         diagnosis,
//         disease_info: diseaseInfo[diseaseName],
//       });
//     } catch (error) {
//       console.error('Error:', error.message);
//       res.status(500).json({ message: 'Failed to classify and process image', error: error.message });
//     } finally {
//       // Clean up local files and close DB connection
//       fs.unlinkSync(filePath);
//       await client.close();
//     }
//   });
// };

// // Report Diagnosis Logic
// const reportDiagnosis = async (req, res) => {
//   const { diagnosisId, comment } = req.body; // Removed conflicting 'diagnosis'
//   // Check if diagnosisId is provided
//   if (!diagnosisId) {
//     return res.status(400).json({ message: 'Diagnosis ID is required.' });
//   }

//   // Validate diagnosisId format
//   if (!ObjectId.isValid(diagnosisId)) {
//     return res.status(400).json({ message: 'Invalid diagnosis ID format.' });
//   }

//   try {
//     // Find the corresponding diagnosis
//     const foundDiagnosis = await Diagnosis.findById(diagnosisId);
//     if (!foundDiagnosis) {
//       return res.status(404).json({ message: 'Diagnosis not found.' });
//     }

//     // Create a new report
//     const report = new Report({
//       diagnosisId,
//       comment,
//     });

//     await report.save();

//     // Mark the diagnosis as reported
//     const updatedDiagnosis = await Diagnosis.findByIdAndUpdate(
//       diagnosisId,
//       { reported: true },
//       { new: true } // Return the updated document
//     );

//     res.json({
//       message: 'Report submitted successfully',
//       report,
//       updatedDiagnosis,
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to submit the report', error: error.message });
//   }
// };



// module.exports = { uploadDiagnosis, reportDiagnosis };