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
    required: [true, 'Category is required'],
    enum: ['electronics', 'vehicles', 'properties', 'services', 'other']
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
  
  // Contact inquiries (buyer info to admin)
  inquiries: [{
    buyerName: String,
    buyerEmail: String,
    buyerPhone: String,
    message: String,
    inquiredAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'closed'],
      default: 'new'
    }
  }],
  
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

// Pre-save middleware 
// productSchema.pre('save', function(next) {
//   try {
    
//     if (!this.description || typeof this.description !== 'string') {
//       return next();
//     }
    
//     // Create a new description to avoid mutation issues
//     let cleanDescription = this.description;
    
//     // Remove phone numbers (10+ digits)
//     cleanDescription = cleanDescription.replace(/\b\d{10,}\b/g, '[CONTACT REMOVED]');
    
//     // Remove email addresses
//     cleanDescription = cleanDescription.replace(/[\w.-]+@[\w.-]+\.\w+/g, '[EMAIL REMOVED]');
    
//     // Remove specific phone patterns
//     cleanDescription = cleanDescription.replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[PHONE REMOVED]');
    
//     // Update the description
//     this.description = cleanDescription;
    
//     next();
//   } catch (error) {
//     // Log the error and pass it to mongoose
//     console.error('Error in product pre-save middleware:', error);
//     next(error);
//   }
// });

// Alternative: If you're using async/await in the future
// productSchema.pre('save', async function() {
//   if (!this.description || typeof this.description !== 'string') {
//     return;
//   }
//   
//   let cleanDescription = this.description;
//   cleanDescription = cleanDescription.replace(/\b\d{10,}\b/g, '[CONTACT REMOVED]');
//   cleanDescription = cleanDescription.replace(/[\w.-]+@[\w.-]+\.\w+/g, '[EMAIL REMOVED]');
//   cleanDescription = cleanDescription.replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[PHONE REMOVED]');
//   this.description = cleanDescription;
// });

// Indexes for performance
productSchema.index({ status: 1, isActive: 1 });
productSchema.index({ postedBy: 1 });
productSchema.index({ category: 1 });
productSchema.index({ createdAt: -1 });



module.exports = mongoose.model('Product', productSchema);