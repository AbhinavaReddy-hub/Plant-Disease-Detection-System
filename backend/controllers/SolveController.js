// const Diagnosis = require('../models/Diagnosis');
// const Report = require('../models/Report');
// const mongoose = require('mongoose');

// // Fetch unsolved cases based on reports
// const getCases = async (req, res) => {
//   try {
//     // Group reports by date
//     const groupedReports = await Report.aggregate([
//       {
//         $group: {
//           _id: {
//             $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }, // Group by report creation date
//           },
//           reports: { $push: "$$ROOT" }, // Push entire report document
//           count: { $sum: 1 }, // Count the number of reports per date
//         },
//       },
//       { $sort: { _id: -1 } }, // Sort by date (newest first)
//     ]);

//     res.json(groupedReports);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching cases', error: error.message });
//   }
// };

// // Solve a case based on a report
// const solveCase = async (req, res) => {
//   const { reportId, comment } = req.body;

//   if (!reportId) {
//     return res.status(400).json({ message: 'Report ID is required' });
//   }

//   try {
//     const reportObjectId = new mongoose.Types.ObjectId(reportId);

//     // Update the Report to mark it as resolved
//     const updatedReport = await Report.findByIdAndUpdate(
//       reportObjectId,
//       { solved: true, comment },
//       { new: true }
//     );

//     if (updatedReport) {
//       res.json({ message: 'Report marked as solved', updatedReport });
//     } else {
//       res.status(404).json({ message: 'Report not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'Error solving report', error: error.message });
//   }
// };

// module.exports = { getCases, solveCase };
const Diagnosis = require('../models/Diagnosis');
const Report = require('../models/Report');
const mongoose = require('mongoose');

// Fetch unsolved cases based on reports
const getCases = async (req, res) => {
  try {
    const groupedReports = await Report.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          reports: { $push: "$$ROOT" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
    ]);

    res.json(groupedReports);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cases', error: error.message });
  }
};

// Solve a case based on a report
const solveCase = async (req, res) => {
  const { reportId, comment } = req.body;

  if (!reportId) {
    return res.status(400).json({ message: 'Report ID is required' });
  }

  try {
    const reportObjectId = new mongoose.Types.ObjectId(reportId);

    const updatedReport = await Report.findByIdAndUpdate(
      reportObjectId,
      { solved: true, comment },
      { new: true }
    );

    if (updatedReport) {
      res.json({ message: 'Report marked as solved', updatedReport });
    } else {
      res.status(404).json({ message: 'Report not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error solving report', error: error.message });
  }
};

// Fetch detailed information for a specific case
const getCaseDetails = async (req, res) => {
  const { caseId } = req.params;

  if (!caseId) {
    return res.status(400).json({ message: 'Case ID is required' });
  }

  try {
    const report = await Report.findById(caseId);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    const diagnosis = await Diagnosis.findById(report.diagnosisId);

    if (!diagnosis) {
      return res.status(404).json({ message: 'Diagnosis not found' });
    }

    res.json({
      _id: report._id,
      userId :diagnosis.user_id,
      diagnosisId:report.diagnosisId,
      diseaseName: diagnosis.disease_name,
      confidenceScore: diagnosis.confidence_score,
      location: diagnosis.location,
      diagnosisDate: diagnosis.diagnosis_date,
      imageUrl: diagnosis.image_url,
      comment: report.comment,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching case details', error: error.message });
  }
};

module.exports = { getCases, solveCase, getCaseDetails };
