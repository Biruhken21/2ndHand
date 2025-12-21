const Product = require('../models/Product');
const User = require('../models/User');
 const Inquiry = require('../models/Inquiry');
const mongoose = require('mongoose');

/**
 * @desc    Get pending products for approval
 * @route   GET /api/admin/products/pending
 * @access  Private/Admin
 */
exports.getPendingProducts = async (req, res) => {
  try {
    // Validate and sanitize query parameters
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    // Fetch pending products with pagination
    const [products, total] = await Promise.all([
      Product.find({ status: 'pending' })
        .populate('postedBy', 'name email phone')
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(limit)
        .select('-__v')
        .lean(),
      Product.countDocuments({ status: 'pending' })
    ]);

    // Format response
    const formattedProducts = products.map(product => ({
      id: product._id,
      title: product.title,
      description: product.description,
      price: product.price,
      priceType: product.priceType,
      category: product.category,
      location: product.location,
      images: product.images,
      postedBy: product.postedBy,
      createdAt: product.createdAt,
      approvalMessage: product.approvalMessage
    }));

    res.status(200).json({
      success: true,
      count: formattedProducts.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      limit,
      products: formattedProducts
    });

  } catch (error) {
    console.error('❌ Get pending products error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Server error while fetching pending products',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


 //   Approve or reject pending product
 //   PUT /api/admin/products/:id/approve
 //  Private/Admin
 
exports.approveProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, reason } = req.body;

    console.log(`🚀 Approve request: ${id}, action: ${action}, reason: ${reason}`);

    // Validate required parameters
    if (!action || !['approve', 'reject'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid action. Must be "approve" or "reject"'
      });
    }

    // Find and validate product
    const product = await Product.findById(id)
      .populate('postedBy', 'name email phone');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Product is already ${product.status}. Cannot ${action}.`
      });
    }

    // Update product based on action
    if (action === 'approve') {
      product.status = 'approved';
      product.approvedAt = new Date();
      product.isActive = true;
      product.approvalMessage = reason || 'Product approved by admin';
    } else {
      product.status = 'rejected';
      product.rejectedAt = new Date();
      product.isActive = false;
      product.rejectionReason = reason || 'Product rejected by admin';
    }

    await product.save();

    console.log(`✅ Product ${action}ed: ${product.title}`);

    // Prepare response
    const response = {
      success: true,
      message: `Product ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
      product: {
        id: product._id,
        title: product.title,
        status: product.status,
        approvalMessage: product.approvalMessage,
        rejectionReason: product.rejectionReason,
        isActive: product.isActive,
        updatedAt: product.updatedAt
      }
    };

    if (action === 'approve') {
      response.product.approvedAt = product.approvedAt;
    } else {
      response.product.rejectedAt = product.rejectedAt;
    }

    res.status(200).json(response);

  } catch (error) {
    console.error('❌ Approve product error:', error.message);
    console.error('Error stack:', error.stack);

    res.status(500).json({
      success: false,
      message: 'Server error while processing approval',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * @desc    Get all approved products (admin view)
 * @route   GET /api/admin/products
 * @access  Private/Admin
 */
exports.getAllProducts = async (req, res) => {
  try {
    // Validate query parameters
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;
    const status = req.query.status || 'approved';

    // Build filter
    const filter = { status };
    if (req.query.category && req.query.category !== 'all') {
      filter.category = req.query.category;
    }

    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Fetch products with pagination
    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('postedBy', 'name email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-__v')
        .lean(),
      Product.countDocuments(filter)
    ]);

    // Format products
    const formattedProducts = products.map(product => ({
      id: product._id,
      title: product.title,
      description: product.description?.substring(0, 150) + '...',
      price: product.price,
      priceType: product.priceType,
      category: product.category,
      location: product.location,
      images: product.images,
      status: product.status,
      postedBy: product.postedBy,
      views: product.views || 0,
      likes: product.likes?.length || 0,
      favorites: product.favorites?.length || 0,
      createdAt: product.createdAt,
      approvedAt: product.approvedAt
    }));

    res.status(200).json({
      success: true,
      count: formattedProducts.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      limit,
      status,
      products: formattedProducts
    });

  } catch (error) {
    console.error('❌ Get all products error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Server error while fetching products',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get all users
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
exports.getAllUsers = async (req, res) => {
  try {
    // Validate query parameters
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};
    if (req.query.role && req.query.role !== 'all') {
      filter.role = req.query.role;
    }

    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Fetch users with pagination
    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-password -__v')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(filter)
    ]);

    // Get user statistics
    const userStats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    // Format users
    const formattedUsers = users.map(user => ({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      postCount: user.postCount || 0,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }));

    res.status(200).json({
      success: true,
      count: formattedUsers.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      limit,
      stats: {
        totalUsers: total,
        roleDistribution: userStats
      },
      users: formattedUsers
    });

  } catch (error) {
    console.error('❌ Get all users error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Server error while fetching users',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


// get all inquiries
exports.getAllInquiries = async (req, res) => {
  try {
    // Validate query parameters
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;
    const status = req.query.status || 'all';
    const search = req.query.search || '';

    // Build base query
    let query = {};

    // Filter by status if not 'all'
    if (status !== 'all') {
      query.status = status;
    }

    // Search functionality
    if (search) {
      query.$or = [
        { buyerName: { $regex: search, $options: 'i' } },
        { buyerEmail: { $regex: search, $options: 'i' } },
        { buyerPhone: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }

    // Get total count
    const total = await Inquiry.countDocuments(query);

    // Fetch inquiries with populated data - UPDATED TO INCLUDE LOCATION & CATEGORY
    const inquiries = await Inquiry.find(query)
      .populate({
        path: 'productId',
        select: 'title price images location category postedBy', // ADDED location and category
        populate: {
          path: 'postedBy',
          select: 'name email phone'
        }
      })
      .populate({
        path: 'buyerId',
        select: 'name email phone'
      })
      .populate({
        path: 'sellerId',
        select: 'name email phone'
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Format the response - UPDATED TO INCLUDE LOCATION & CATEGORY
    const formattedInquiries = inquiries.map(inquiry => ({
      inquiryId: inquiry._id,
      _id: inquiry._id, // Keep both for compatibility
      
      productId: inquiry.productId?._id,
      productTitle: inquiry.productId?.title || 'Product Not Found',
      productPrice: inquiry.productId?.price,
      productImage: inquiry.productId?.images?.[0],
      productLocation: inquiry.productId?.location, // ADDED
      productCategory: inquiry.productId?.category, // ADDED
      
      // Buyer info (from inquiry fields)
      buyerName: inquiry.buyerName,
      buyerEmail: inquiry.buyerEmail,
      buyerPhone: inquiry.buyerPhone,
      buyerId: inquiry.buyerId?._id,
      
      // Seller/Broker info (from populated product owner)
      brokerName: inquiry.productId?.postedBy?.name || inquiry.sellerId?.name,
      brokerEmail: inquiry.productId?.postedBy?.email || inquiry.sellerId?.email,
      brokerPhone: inquiry.productId?.postedBy?.phone || inquiry.sellerId?.phone,
      
      // Seller reference
      sellerId: inquiry.sellerId?._id,
      sellerName: inquiry.sellerId?.name,
      sellerEmail: inquiry.sellerId?.email,
      sellerPhone: inquiry.sellerId?.phone,
      
      // Message and status
      message: inquiry.message,
      status: inquiry.status,
      inquiredAt: inquiry.createdAt,
      createdAt: inquiry.createdAt,
      updatedAt: inquiry.updatedAt,
      
      // Additional populated references (optional)
      buyerInfo: inquiry.buyerId, // Full buyer object if needed
      sellerInfo: inquiry.sellerId, // Full seller object if needed
      productInfo: inquiry.productId // Full product object if needed
    }));

    // Get status counts
    const statusCounts = await Inquiry.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      count: formattedInquiries.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      limit,
      status,
      statusCounts,
      inquiries: formattedInquiries
    });

  } catch (error) {
    console.error('❌ Get all inquiries error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Server error while fetching inquiries',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};