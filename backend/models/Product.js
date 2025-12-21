const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  priceType: {
    type: String,
    enum: ['fixed', 'negotiable'],
    default: 'fixed'
  },
  category: {
    type: String,
    enum: [
      'electronics',
      'vehicles', 
      'furniture',
      'appliances',
      'home',
      'sports',
      'services',
      'other'
    ],
    required: [true, 'Category is required']
  },
  location: {
    type: String,
    required: [true, 'Location is required']
  },
  images: {
    type: [String],
    required: [true, 'At least 1 image is required'],
    validate: {
      validator: function(arr) {
        // Check if it's an array and has 1-3 items
        return Array.isArray(arr) && arr.length >= 1 && arr.length <= 3;
      },
      message: 'Please upload 1 to 3 images only'
    }
  },
  
  // Approval system
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'sold'],
    default: 'pending'
  },
  approvalMessage: {
    type: String,
    default: 'Your product is under review. It will be approved within 24 hours.'
  },
  approvedAt: Date,
  
  // User interactions
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  shares: {
    type: Number,
    default: 0
  },
  
  // Broker info (posted by) - REQUIRED
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // REMOVED: inquiries field (now in separate Inquiry model)
  // inquiries: [{
  //   buyerName: String,
  //   buyerEmail: String,
  //   buyerPhone: String,
  //   message: String,
  //   inquiredAt: {
  //     type: Date,
  //     default: Date.now
  //   },
  //   status: {
  //     type: String,
  //     enum: ['new', 'contacted', 'closed'],
  //     default: 'new'
  //   }
  // }],
  
  // Metadata
  views: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  soldAt: Date
}, {
  timestamps: true
});

// Indexes for performance
productSchema.index({ status: 1, isActive: 1 });
productSchema.index({ postedBy: 1 });
productSchema.index({ category: 1 });
productSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Product', productSchema);