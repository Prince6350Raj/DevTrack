const express = require('express');
const router = Router = express.Router();
const {
  getNotifications,
  markAsRead,
  markAllAsRead
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // Protect all routes

router.get('/', getNotifications);
router.put('/read-all', markAllAsRead);
router.put('/:id', markAsRead);

module.exports = router;
