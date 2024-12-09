const Notification = require('../models/NotificationModel');
const User = require('../models/User');
const Post = require('../models/Post');
const { v4: uuidv4 } = require('uuid'); // For unique notification IDs
const Diagnosis = require('../models/Diagnosis');
const Report = require('../models/Report');
// Fetch Notifications
exports.getNotifications = async (req, res) => {
  try {
    // const userId = req.params.userId;
    const userId = 40;
    const notifications = await Notification.findOne({ user_id: userId });
    res.status(200).json(notifications || { user_id: userId, notifications: [] });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error });
  }
};

// Delete Notification
exports.deleteNotification = async (req, res) => {
  try {
    const { userId, notificationId } = req.body;
    const notification = await Notification.findOneAndUpdate(
      // { user_id: userId },
      { user_id: 40},

      { $pull: { notifications: { id: notificationId } } },
      { new: true }
    );
    if (notification) {
      res.status(200).json({ message: 'Notification deleted', notification });
    } else {
      res.status(404).json({ message: 'Notification not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting notification', error });
  }
};
// / Function to handle creating a blog and sending a notification
exports.createBlogAndNotifyUser = async (req, res) => {
  try {
    const {
      caseId,
      userId,
      diagnosisId,
      diseaseName,
      diseaseSymptoms,
      organicTreatment,
      inorganicTreatment,
      preventiveMeasure,
      conclusion,
    } = req.body;
    console.log(caseId,
      userId,
      diagnosisId,
      diseaseName,
      diseaseSymptoms,
      organicTreatment,
      inorganicTreatment,
      preventiveMeasure,
      conclusion,);
      if (!caseId || !userId || !diagnosisId || !diseaseName || !diseaseSymptoms) {
        return res.status(400).json({ message: "Missing required fields" });
      }
  
      // Update the Diagnosis object with the new disease name
      const diagnosis = await Diagnosis.findById(diagnosisId);
      if (!diagnosis) {
        return res.status(404).json({ message: "Diagnosis not found" });
      }
  
      diagnosis.disease_name = diseaseName;
      diagnosis.confidence_score=1;
      await diagnosis.save();

    // Format content for the blog
    const content = `
      Disease name:${diseaseName}
      Symptoms: ${diseaseSymptoms}
      Organic Treatment:${organicTreatment}
      Inorganic Treatment:${inorganicTreatment}
      Preventive Measures: ${preventiveMeasure}
      Conclusion:${conclusion}
    `;
     console.log(content);
    // Create the blog post
    const newBlog = new Post({
      title: `Solved Report: ${diseaseName}`,
      username: `User_${userId}`,
      content,
    });

    await newBlog.save();

    // Create the notification
    const notification = {
      id: uuidv4(),
      note: "Solved Your Report",
      title: `Solved: ${diseaseName}`,
      desc: `A detailed report for ${diseaseName} has been resolved.`,
      createdAt: new Date(),
      read: false,
      blogUrl: `/blogs/${newBlog._id}`,
    };

    // Update notifications collection for the user
    const userNotification = await Notification.findOne({ user_id: userId });
    if (userNotification) {
      userNotification.notifications.push(notification);
      await userNotification.save();
    } else {
      const newNotification = new Notification({
        user_id: userId,
        notifications: [notification],
      });
      await newNotification.save();
    }
    // const deletedReport = await Report.findOneAndDelete({ _id: caseId });
    // if (!deletedReport) {
    //   return res.status(404).json({ message: "Report not found with the provided caseId." });
    // }
    res.status(201).json({
      message: "Diagnosis report submitted and blog created successfully!",
      blogId: newBlog._id,
    });
  } catch (error) {
    console.error("Error creating blog and notification:", error.message);
    res.status(500).json({ message: "Failed to create blog or send notification.", error });
  }
};

exports.createBlogAndSendAlert = async (req, res) => {
  try {
    const { title, username, content, district, effect } = req.body;
    // console.log(title, username, content, district, effect );
    const image= req.file ? req.file.buffer : null;
    // Create a new blog
    // console.log(image);
    const newBlog = new Post({
      title,
      username,
      content,
      image: req.file ? req.file.buffer : null,
    imageType: req.file ? req.file.mimetype : null,
    });

    await newBlog.save();
    // console.log("blog created");
    // Find users in the specified district
    const location=district;
    const users= await User.find({location});
    // console.log("userids fetched",users);
    const alertMessage = `New Alert: ${title}`;
    const blogUrl = newBlog ?`/blogs/${newBlog._id}` : null;
    // console.log("blogurl",blogUrl);
    for (const user of users) {
      const notification = {
        id: uuidv4(),
        note: "New Alert!!",
        title: title,
        desc: alertMessage,
        createdAt: new Date(),
        read: false,
        blogUrl, // Add the blog URL to the notification
      };
      // console.log(notification);
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
    
    console.log(`Alert notifications sent to users in ${location}.`);
    res.status(201).json({ message: 'Blog created and notifications sent successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating blog and sending notifications', error });
  }
};