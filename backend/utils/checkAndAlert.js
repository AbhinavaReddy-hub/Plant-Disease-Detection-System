const User = require('../models/User');
const LocationAnalysis = require('../models/LocationAnalysis');
const Notification = require('../models/NotificationModel');
const Post = require("../models/Post"); // Assuming this is your posts collection model
const { queueEmails } = require('../utils/queueHelper');
const { v4: uuidv4 } = require('uuid'); // For unique notification IDs
const THRESHOLD = 13;

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

      if (monthData && monthData.disease_counts.count > THRESHOLD) {
        const totalCount = monthData.disease_counts.count;
        console.log(`ALERT: Disease ${diseaseName} cases in ${location} have exceeded the threshold. Total count: ${totalCount}`);

        const users = await User.find({ location });
        const emails = users.map(user => user.email);
        await queueEmails(users, diseaseName, location, totalCount);

        const alertMessage = `Disease Alert: ${diseaseName} cases in ${location} have exceeded ${THRESHOLD} with a total of ${totalCount} cases.`;

        // // Fetch the blog associated with the disease
        // const blog = await Post.findOne({ title: diseaseName });
        // const blogUrl = blog ? blog.url : null;
        // Find related blog post by matching `note` with blog title
        const blogPost = await Post.findOne({ title: diseaseName });
        console.log(blogPost);
        const blogUrl = blogPost ? `/blogs/${blogPost._id}` : null;


        for (const user of users) {
          const notification = {
            id: uuidv4(),
            note: diseaseName,
            title: 'Disease Alert',
            desc: alertMessage,
            createdAt: new Date(),
            read: false,
            blogUrl, // Add the blog URL to the notification
          };

          const userNotification = await Notification.findOne({ user_id: user.user_id });
          if (userNotification) {
            const isDuplicate = userNotification.notifications.some(n => n.desc === alertMessage);
            if (!isDuplicate) {
              userNotification.notifications.push(notification);
              await userNotification.save();
            }
          } else {
            const newNotification = new Notification({
              user_id: user.user_id,
              notifications: [notification],
            });
            await newNotification.save();
          }
        }

        console.log(`Alert notifications sent for ${totalCount} cases of ${diseaseName} in ${location}.`);
        console.log(`Alert queued for emails: ${emails.join(', ')}`);
      }
    }
  } catch (error) {
    console.error('Error in checkAndAlert:', error);
  }
};
