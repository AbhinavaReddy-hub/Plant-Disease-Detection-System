const User = require('../models/User');
const LocationAnalysis = require('../models/LocationAnalysis');
const { queueEmails } = require('../utils/queueHelper');
const THRESHOLD = 2;

exports.checkAndAlert = async (diseaseName, location) => {
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const currentYear = new Date().getFullYear();

  try {
    // Fetch the location data from LocationAnalysis
    const locationData = await LocationAnalysis.findOne({ "_id.location": location });
    if (locationData) {
      // Find the relevant month data
      const monthData = locationData.summary.find(summary =>
        summary.year === currentYear &&
        summary.month === currentMonth &&
        summary.disease_counts.disease_name === diseaseName
      );

      // Check if the disease count exceeds the threshold
      if (monthData && monthData.disease_counts.count > THRESHOLD) {
        const totalCount = monthData.disease_counts.count; // Store the count for readability
        console.log(`ALERT: Disease ${diseaseName} cases in ${location} have exceeded the threshold. Total count: ${totalCount}`);

        // Fetch users in the specified location
        // const users = await User.find({ location });
        // // Fetch users in the location and queue email alerts
        const users = await User.find({ location })
        // Extract emails from users
        const emails = users.map(user => user.email);
        // Queue email alerts to users
        await queueEmails(users, diseaseName, location, totalCount);
        console.log(`Alert queued for ${totalCount} cases of ${diseaseName} in ${location} for emails: ${emails.join(', ')}`);
      }
    }
  } catch (error) {
    console.error('Error in checkAndAlert:', error);
  }
};
