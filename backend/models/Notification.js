// models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  // Who receives the notification
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Type of notification
  type: {
    type: String,
    enum: [
      'product_favorited',  // Someone favorited your product
      'new_inquiry',        // New inquiry on your product
      'product_approved',   // Your product was approved
      'product_rejected',   // Your product was rejected
      'product_sold'        // Product marked as sold
    ],
    required: true
  },
  
  // Notification content
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  
  // Related data
  data: {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    inquiryId: String
  },
  
  // Read status
  isRead: {
    type: Boolean,
    default: false,
    index: true
  },
  readAt: Date
  
}, {
  timestamps: true
});

// Indexes for fast queries
notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);