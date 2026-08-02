const Notification = require('../models/Notification');
const Task = require('../models/Task');

// @desc    Get user's notifications (also auto-generates notifications for upcoming deadlines)
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res, next) => {
  try {
    // Auto-generate notifications for tasks due in the next 48 hours
    const upcomingLimit = new Date();
    upcomingLimit.setDate(upcomingLimit.getDate() + 2); // 48 hours from now
    
    const upcomingTasks = await Task.find({
      user: req.user.id,
      status: { $ne: 'Completed' },
      dueDate: { $gte: new Date(), $lte: upcomingLimit }
    }).populate('project', 'name');

    for (const task of upcomingTasks) {
      const message = `Task "${task.title}" in project "${task.project ? task.project.name : 'Unknown'}" is due soon (${new Date(task.dueDate).toLocaleDateString()})`;
      
      // Check if notification already exists for this task to avoid duplicates
      const exists = await Notification.findOne({
        user: req.user.id,
        message: { $regex: task.title, $options: 'i' },
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // created in last 24h
      });

      if (!exists) {
        await Notification.create({
          message,
          user: req.user.id,
          type: 'deadline'
        });
      }
    }

    const notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50); // limit to recent 50

    res.json(notifications);
  } catch (error) {
    next(error);
  }
};

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id
// @access  Private
const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOne({ _id: req.params.id, user: req.user.id });

    if (!notification) {
      res.status(404);
      throw new Error('Notification not found');
    }

    notification.isRead = true;
    await notification.save();

    res.json(notification);
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, isRead: false },
      { isRead: true }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead
};
