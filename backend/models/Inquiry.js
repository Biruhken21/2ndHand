const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  // Required references
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  
  // Required buyer info
  buyerName: {
    type: String,
    required: true
  },
  buyerEmail: {
    type: String,
    required: true
  },
  buyerPhone: {
    type: String,
    required: true
  },
  
  // Required message
  message: {
    type: String,
    required: true,
    trim: true,
    minlength: 5
  },
  
  // Status tracking
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'closed'],
    default: 'new'
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
, { timestamps: true });

// the pre-save hook
// inquirySchema.pre('save', function(next) {
//   this.updatedAt = Date.now();
//   next(); 
// });

// Indexes for performance
inquirySchema.index({ productId: 1, createdAt: -1 });
inquirySchema.index({ buyerId: 1 });
inquirySchema.index({ sellerId: 1, status: 1 });
inquirySchema.index({ status: 1 });

module.exports = mongoose.model('Inquiry', inquirySchema);