// const mongoose = require('mongoose');

// const NotificationSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   },
//   notifications: [
//     {
//       title: { type: String, required: true },
//       desc: { type: String, required: true },
//       read: { type: Boolean, default: false },
//       createdAt: { type: Date, default: Date.now },
//     },
//   ],
// });

// module.exports = mongoose.model('Notification', NotificationSchema);
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  notifications: [
    {
      title: { type: String, required: true },
      desc: { type: String, required: true },
      isRead: { type: Boolean, default: false }, // Tracks if the notification has been read
      createdAt: { type: Date, default: Date.now } // Timestamp
    }
  ]
});

module.exports = mongoose.model('Notification', notificationSchema);
