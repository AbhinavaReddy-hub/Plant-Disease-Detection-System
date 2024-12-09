// const mongoose = require('mongoose');

// const reportSchema = new mongoose.Schema({
//   disease_name: String,
//   user_id: Number,
//   location: String,
//   diagnosis_date: Date,
//   confidence_score: Number,
//   image_url: String,
//   comment: String,
// });

// module.exports = mongoose.model('Report', reportSchema);
const mongoose = require('mongoose');
const { Schema } = mongoose;

const reportSchema = new Schema({
  diagnosisId: {
    type: Schema.Types.ObjectId,
    ref: 'Diagnosis', // Reference to Diagnosis model
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the creation date
  },
});

module.exports = mongoose.model('Report', reportSchema);
