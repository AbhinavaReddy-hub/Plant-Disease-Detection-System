const mongoose = require('mongoose');

const DiagnosisSchema = new mongoose.Schema({
  disease_name: { type: String, required: true },
  user_id: { type: Number, required: true },
  location: { type: String, required: true }, // Added location field
  diagnosis_date: { type: Date, default: Date.now },
  confidence_score: { type: Number, required: true },
  image_url: { type: String, required: true },
  reported: { type: Boolean, default: false },
},
{
  collection: "Diagnoses", // Specify the collection name explicitly
});

module.exports = mongoose.model('Diagnosis', DiagnosisSchema);
// const mongoose = require('mongoose');

// const DiagnosisSchema = new mongoose.Schema(
//   {
//     disease_name: { type: String, required: true },
//     user_id: { type: Number, required: true },
//     location: { type: String, required: true }, // User location
//     diagnosis_date: { type: Date, default: Date.now },
//     confidence_score: { type: Number, required: true },
//     image_url: { type: String, required: true }, // Added field for storing image URL
//   },
//   {
//     collection: "Diagnoses", // Specify the collection name explicitly
//   }
// );

// module.exports = mongoose.model('Diagnosis', DiagnosisSchema);
