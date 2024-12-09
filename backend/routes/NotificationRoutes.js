// const express = require('express');
// const router = express.Router();
// const { getNotifications, deleteNotification ,createBlogAndSendAlert} = require("../controllers/NotificationController");
// // Fetch all notifications for a specific user
// router.get('/:userId', getNotifications);
// // Delete a notification by ID
// router.delete('/delete', deleteNotification);
// // Create a blog post and send alerts
// router.post('/create-and-send-alert', createBlogAndSendAlert);
// module.exports = router;
const express = require('express');
const { upload } = require("../utils/multerConfig");
const { getNotifications, deleteNotification, createBlogAndSendAlert,createBlogAndNotifyUser, } = require("../controllers/NotificationController");
const router = express.Router();
// Fetch all notifications for a specific user
router.get('/:userId', getNotifications);

// Delete a notification by ID
router.delete('/delete', deleteNotification);
// Create a blog post and send a notification
router.post("/create-diagnosis-blog", createBlogAndNotifyUser);
// Create a blog post and send alerts
router.post("/create-and-send-alert", upload.single("image"), createBlogAndSendAlert);
module.exports = router;
