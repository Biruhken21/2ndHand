const Notification = require('../models/Notification.js');
const User = require('../models/User.js');
const Product = require('../models/Product.js');

// get all notifications for the current user
exports.getUserNotifications = async (req, res) => {
    try {
       const userId = req.user.id;

       // get pagination params - FIXED: default page should be 1, not 2
       const page = parseInt(req.query.page) || 1;
       const limit = parseInt(req.query.limit) || 10;
       const skip = (page - 1) * limit;

       // build query
       let query = { user: userId };

       if (req.query.read !== undefined) {
         query.isRead = req.query.read === 'true';
       }

       // get notifications with pagination - FIXED: countDocuments syntax
       const [notifications, total, unreadCount] = await Promise.all([
         Notification.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
         Notification.countDocuments(query),
         Notification.countDocuments({ user: userId, isRead: false }) // FIXED: Separate query for unread
       ]);

       // format response
       const formattedNotifications = notifications.map(notification => ({
         id: notification._id,
         type: notification.type,
         title: notification.title,
         message: notification.message,
         isRead: notification.isRead,
         data: notification.data, // Add this if you want to include data
         createdAt: notification.createdAt,
         updatedAt: notification.updatedAt
       }));

       // FIXED: Math.ceil not math.ceil
       res.status(200).json({
        success: true,
        count: notifications.length,
        total,
        unreadCount,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        notifications: formattedNotifications
       });

    } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching notifications'
        });
    }
};

// mark as read controller
exports.markAsRead = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user.id;

    const notification = await Notification.findOne({
      _id: notificationId,
      user: userId
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    if (!notification.isRead) {
      notification.isRead = true;
      notification.readAt = new Date();
      await notification.save();
    }

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      notification: {
        id: notification._id,
        isRead: notification.isRead,
        readAt: notification.readAt
      }
    });

  } catch (error) {
    console.error('Error during mark as read:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};