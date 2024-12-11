// const express = require('express');
// const { getNotifications, addNotification, deleteNotification, markAsRead } = require('../controllers/notificationController');
// const router = express.Router();

// router.get('/:userId', getNotifications); // Fetch notifications for a user
// router.post('/:userId', addNotification); // Add a new notification
// router.delete('/:userId/:notifId', deleteNotification); // Delete a notification
// router.patch('/:userId/:notifId', markAsRead); // Mark a notification as read

// module.exports = router;
const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// 1. Add a new notification
router.post('/add', async (req, res) => {
  try {
    const { userId, title, desc } = req.body;

    let userNotifications = await Notification.findOne({ userId });
    if (!userNotifications) {
      userNotifications = new Notification({ userId, notifications: [] });
    }

    userNotifications.notifications.push({ title, desc });
    await userNotifications.save();

    res.status(200).json({ message: 'Notification added successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add notification.' });
  }
});

// 2. Get notifications for a user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const userNotifications = await Notification.findOne({ userId });
    if (!userNotifications) {
      return res.status(404).json({ message: 'No notifications found for this user.' });
    }

    res.status(200).json(userNotifications.notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch notifications.' });
  }
});

// 3. Mark notification as read
router.patch('/mark-read', async (req, res) => {
  try {
    const { userId, notificationId } = req.body;

    const userNotifications = await Notification.findOne({ userId });
    if (userNotifications) {
      const notification = userNotifications.notifications.id(notificationId);
      if (notification) {
        notification.isRead = true;
        await userNotifications.save();
        return res.status(200).json({ message: 'Notification marked as read.' });
      }
    }

    res.status(404).json({ message: 'Notification not found.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to mark notification as read.' });
  }
});

// 4. Delete a notification
router.delete('/delete', async (req, res) => {
  try {
    const { userId, notificationId } = req.body;

    const userNotifications = await Notification.findOne({ userId });
    if (userNotifications) {
      userNotifications.notifications = userNotifications.notifications.filter(
        (notif) => notif._id.toString() !== notificationId
      );
      await userNotifications.save();
      return res.status(200).json({ message: 'Notification deleted successfully.' });
    }

    res.status(404).json({ message: 'Notification not found.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete notification.' });
  }
});

module.exports = router;
