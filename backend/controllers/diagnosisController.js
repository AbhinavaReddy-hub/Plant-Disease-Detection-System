// const path = require('path');
// const multer = require('multer');
// const { exec } = require('child_process');
// const Diagnosis = require('../models/Diagnosis');
// const User = require('../models/User');
// const { checkAndAlert } = require('../utils/checkAndAlert');

// // Setup storage for file uploads
// const storage = multer.diskStorage({
//   destination: 'uploads/',
//   filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
// });
// const upload = multer({ storage }).single('image');

// const uploadDiagnosis = (req, res) => {
//   upload(req, res, async (err) => {
//     if (err) return res.status(500).json({ message: 'Image upload failed', error: err });

//     exec(`python "${path.join(__dirname, '../classify.py')}" "${req.file.path}"`, async (error, stdout) => {
//       if (error) return res.status(500).json({ message: 'Failed to classify image', error: error.message });

//       const lines = stdout.trim().split('\n');
//       if (lines[0] === 'Not a leaf') {
//         return res.json({ output: 'Not a leaf' });
//       }

//       const parsedData = JSON.parse(lines[0]);
//       const diseaseName = parsedData.disease_name;
//       const confidenceScore = parseFloat(parsedData.confidence_score);
//       const userId = req.body.user_id || 4;

//       try {
//         // Fetch user location from DB
//         const user = await User.findOne({ user_id: userId });
//         if (!user) return res.status(404).json({ message: 'User not found.' });

//         const diagnosis = new Diagnosis({
//           disease_name: diseaseName,
//           user_id: userId,
//           location: user.location,
//           diagnosis_date: new Date(),
//           confidence_score: confidenceScore,
//         });

//         await diagnosis.save();
//         // await checkAndAlert("Peach___Bacterial_spot", user.location);
//         await checkAndAlert(diseaseName, user.location); // Trigger alert Peach___Bacterial_spot
//         res.json({ message: 'Diagnosis stored', output: `Disease Name: ${diseaseName}, Confidence Score: ${confidenceScore}`, diagnosis });
//       } catch (dbError) {
//         res.status(500).json({ message: 'Failed to save diagnosis', error: dbError.message });
//       }
//     });
//   });
// };

// module.exports = { uploadDiagnosis };
