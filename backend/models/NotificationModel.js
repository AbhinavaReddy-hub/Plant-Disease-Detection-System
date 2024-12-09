// // backend/models/NotificationModel.js
// const mongoose = require('mongoose');

// const NotificationSchema = new mongoose.Schema({
//   user_id: {
//     type: Number,
//     required: true
//   },
//   notifications: [
//     {
//       id: {
//         type: String,
//         required: true
//       },
//       title: {
//         type: String,
//         required: true
//       },
//       desc: {
//         type: String,
//         required: true
//       },
//       createdAt: {
//         type: Date,
//         default: Date.now
//       },
//       read: {
//         type: Boolean,
//         default: false
//       }
//     }
//   ],
//   lastUpdated: {
//     type: Date,
//     default: Date.now
//   }
// });

// module.exports = mongoose.model('Notification', NotificationSchema);
// const mongoose = require('mongoose');

// const NotificationSchema = new mongoose.Schema({
//   user_id: {
//     type: Number,
//     required: true
//   },
//   notifications: [
//     {
//       id: { type: String, required: true },
//       note: { type: String, required: true }, 
//       title: { type: String, required: true },
//       desc: { type: String, required: true },
//       createdAt: { type: Date, default: Date.now },
//       read: { type: Boolean, default: false }
//     }
//   ]
// });

// module.exports = mongoose.model('Notification', NotificationSchema);
// const mongoose = require('mongoose');

// const NotificationSchema = new mongoose.Schema({
//   user_id: { type: Number, required: true },
//   notifications: [
//     {
//       id: { type: String, required: true },
//       note: { type: String, required: true }, // Ensure it's defined and required
//       title: { type: String, required: true },
//       desc: { type: String, required: true },
//       createdAt: { type: Date, required: true },
//       read: { type: Boolean, default: false },
//     },
//   ],
// });

// module.exports = mongoose.model('Notification', NotificationSchema);
const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  user_id: { type: Number, required: true },
  notifications: [
    {
      id: { type: String, required: true },
      note: { type: String, required: true },
      title: { type: String, required: true },
      desc: { type: String, required: true },
      createdAt: { type: Date, required: true },
      read: { type: Boolean, default: false },
      blogUrl: { type: String, default: null } // New field to store the blog URL
    },
  ],
});

module.exports = mongoose.model('Notification', NotificationSchema);
