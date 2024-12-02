const Notification = require('../models/Notification');

// Fetch notifications for a user
exports.getNotifications = async (req, res) => {
  const { userId } = req.params;
  try {
    const userNotifications = await Notification.findOne({ userId });
    if (!userNotifications) {
      return res.status(404).json({ message: 'No notifications found' });
    }
    res.status(200).json(userNotifications.notifications);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Add a new notification
exports.addNotification = async (req, res) => {
  const { userId } = req.params;
  const { title, desc } = req.body;

  try {
    let userNotifications = await Notification.findOne({ userId });
    if (!userNotifications) {
      userNotifications = new Notification({ userId, notifications: [] });
    }

    userNotifications.notifications.push({ title, desc });
    await userNotifications.save();
    res.status(201).json({ message: 'Notification added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Delete a notification
exports.deleteNotification = async (req, res) => {
  const { userId, notifId } = req.params;
  try {
    const userNotifications = await Notification.findOne({ userId });
    if (!userNotifications) {
      return res.status(404).json({ message: 'No notifications found' });
    }

    userNotifications.notifications = userNotifications.notifications.filter(
      (notif) => notif._id.toString() !== notifId
    );

    await userNotifications.save();
    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Mark a notification as read
exports.markAsRead = async (req, res) => {
  const { userId, notifId } = req.params;
  try {
    const userNotifications = await Notification.findOne({ userId });
    if (!userNotifications) {
      return res.status(404).json({ message: 'No notifications found' });
    }

    const notif = userNotifications.notifications.find(
      (n) => n._id.toString() === notifId
    );

    if (notif) {
      notif.read = true;
      await userNotifications.save();
      return res.status(200).json({ message: 'Notification marked as read' });
    }

    res.status(404).json({ message: 'Notification not found' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};
