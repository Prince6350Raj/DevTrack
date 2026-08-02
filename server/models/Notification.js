const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: [true, 'Notification message is required']
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    isRead: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      enum: ['deadline', 'info', 'alert'],
      default: 'info'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Notification', NotificationSchema);
