const Product = require('../models/Product');
const User = require('../models/User');
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

/**
 * @desc    Get all inquiries
 * @route   GET /api/admin/inquiries
 * @access  Private/Admin
 */
exports.getAllInquiries = async (req, res) => {
  try {
    // Validate query parameters
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;
    const status = req.query.status || 'all';

    // Build aggregation pipeline
    const pipeline = [
      { $match: { 'inquiries.0': { $exists: true } } },
      { $unwind: '$inquiries' }
    ];

    // Filter by status if not 'all'
    if (status !== 'all') {
      pipeline.push({
        $match: { 'inquiries.status': status }
      });
    }

    // Count total
    const countPipeline = [...pipeline, { $count: 'total' }];
    
    // Add pagination and formatting
    pipeline.push(
      { $sort: { 'inquiries.inquiredAt': -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: 'postedBy',
          foreignField: '_id',
          as: 'postedBy'
        }
      },
      { $unwind: '$postedBy' },
      {
        $project: {
          inquiryId: '$inquiries._id',
          productId: '$_id',
          productTitle: '$title',
          productImage: { $arrayElemAt: ['$images', 0] },
          brokerName: '$postedBy.name',
          brokerEmail: '$postedBy.email',
          buyerName: '$inquiries.buyerName',
          buyerEmail: '$inquiries.buyerEmail',
          buyerPhone: '$inquiries.buyerPhone',
          message: '$inquiries.message',
          status: '$inquiries.status',
          inquiredAt: '$inquiries.inquiredAt'
        }
      }
    );

    // Execute queries
    const [inquiries, countResult] = await Promise.all([
      Product.aggregate(pipeline),
      Product.aggregate(countPipeline)
    ]);

    const total = countResult[0]?.total || 0;

    // Get status counts
    const statusCounts = await Product.aggregate([
      { $unwind: '$inquiries' },
      {
        $group: {
          _id: '$inquiries.status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      count: inquiries.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      limit,
      status,
      statusCounts,
      inquiries
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