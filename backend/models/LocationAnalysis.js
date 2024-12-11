const mongoose = require("mongoose");

const diseaseCountSchema = new mongoose.Schema(
  {
    disease_name: { type: String, required: true },
    count: { type: Number, required: true },
  },
  { _id: false } // Prevent Mongoose from adding an _id field for subdocuments
);

const summarySchema = new mongoose.Schema(
  {
    year: { type: Number, required: true },
    month: { type: String, required: true },
    disease_counts: diseaseCountSchema, // Embed diseaseCountSchema
  },
  { _id: false }
);

const locationAnalysisSchema = new mongoose.Schema(
  {
    _id: {
      location: { type: String, required: true },
    },
    summary: [summarySchema], // Array of summaries
  },
  {
    collection: "LocationAnalysis", // Specify the collection name explicitly
  }
);

module.exports = mongoose.model("LocationAnalysis", locationAnalysisSchema);
