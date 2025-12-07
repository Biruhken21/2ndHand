const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Get pending products for approval
// @route   GET /api/admin/products/pending
// @access  Private/Admin
exports.getPendingProducts = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    
    const products = await Product.find({ status: 'pending' })
      .populate('postedBy', 'name email phone postCount')
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(Number(limit));
    
    const total = await Product.countDocuments({ status: 'pending' });
    
    res.json({
      success: true,
      count: products.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: Number(page),
      products: products.map(product => ({
        id: product._id,
        title: product.title,
        description: product.description,
        price: product.price,
        priceType: product.priceType,
        category: product.category,
        location: product.location,
        images: product.images,
        postedBy: {
          id: product.postedBy._id,
          name: product.postedBy.name,
          email: product.postedBy.email,
          phone: product.postedBy.phone,
          postCount: product.postedBy.postCount
        },
        createdAt: product.createdAt,
        approvalMessage: product.approvalMessage
      }))
    });
    
  } catch (error) {
    console.error('Get pending products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching pending products'
    });
  }
};

// @desc    Approve/Reject product
// @route   PUT /api/admin/products/:id/approve
// @access  Private/Admin
exports.approveProduct = async (req, res) => {
  try {
    const { action, reason } = req.body;
    const product = await Product.findById(req.params.id)
      .populate('postedBy', 'name email');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    if (product.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Product is already ${product.status}`
      });
    }
    
    if (action === 'approve') {
      product.status = 'approved';
      product.approvedAt = new Date();
      product.approvalMessage = 'Your product has been approved and is now live on our platform!';
      product.isActive = true;
      
      await product.save();
      
      // Here you would typically send notification to user
      // sendProductApprovalNotification(product.postedBy.email, product.title);
      
      res.json({
        success: true,
        message: 'Product approved successfully',
        product: {
          id: product._id,
          title: product.title,
          status: product.status,
          approvalMessage: product.approvalMessage,
          approvedAt: product.approvedAt
        }
      });
      
    } else if (action === 'reject') {
      product.status = 'rejected';
      product.approvalMessage = reason || 'Your product did not meet our platform requirements.';
      product.isActive = false;
      
      await product.save();
      
      // Here you would typically send rejection notification to user
      // sendProductRejectionNotification(product.postedBy.email, product.title, reason);
      
      res.json({
        success: true,
        message: 'Product rejected',
        product: {
          id: product._id,
          title: product.title,
          status: product.status,
          approvalMessage: product.approvalMessage
        }
      });
      
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid action. Use "approve" or "reject"'
      });
    }
    
  } catch (error) {
    console.error('Approve product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing approval'
    });
  }
};

// @desc    Get all products (admin view)
// @route   GET /api/admin/products
// @access  Private/Admin
exports.getAllProducts = async (req, res) => {
  try {
    const { 
      status, 
      category, 
      search, 
      page = 1, 
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    // Build filter
    const filter = {};
    
    if (status && status !== 'all') {
      filter.status = status;
    }
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    // Sort
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const products = await Product.find(filter)
      .populate('postedBy', 'name email phone')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));
    
    const total = await Product.countDocuments(filter);
    
    // Get status counts for filters
    const statusCounts = await Product.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get category counts
    const categoryCounts = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.json({
      success: true,
      count: products.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: Number(page),
      filters: {
        statusCounts,
        categoryCounts
      },
      products: products.map(product => ({
        id: product._id,
        title: product.title,
        description: product.description.substring(0, 100) + '...',
        price: product.price,
        priceType: product.priceType,
        category: product.category,
        location: product.location,
        images: product.images,
        status: product.status,
        postedBy: product.postedBy,
        views: product.views,
        likes: product.likes.length,
        favorites: product.favorites.length,
        inquiries: product.inquiries.length,
        createdAt: product.createdAt,
        approvedAt: product.approvedAt,
        soldAt: product.soldAt
      }))
    });
    
  } catch (error) {
    console.error('Get all products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products'
    });
  }
};

// @desc    Get single product for admin
// @route   GET /api/admin/products/:id
// @access  Private/Admin
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('postedBy', 'name email phone createdAt')
      .populate('likes', 'name email')
      .populate('favorites', 'name email');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      product: {
        id: product._id,
        title: product.title,
        description: product.description,
        price: product.price,
        priceType: product.priceType,
        category: product.category,
        location: product.location,
        images: product.images,
        status: product.status,
        postedBy: product.postedBy,
        views: product.views,
        likes: product.likes,
        favorites: product.favorites,
        shares: product.shares,
        inquiries: product.inquiries,
        approvalMessage: product.approvalMessage,
        isActive: product.isActive,
        createdAt: product.createdAt,
        approvedAt: product.approvedAt,
        soldAt: product.soldAt
      }
    });
    
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product'
    });
  }
};

// @desc    Update product (admin)
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
  try {
    const { title, description, price, priceType, category, location, status } = req.body;
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Update fields
    if (title) product.title = title;
    if (description) product.description = description;
    if (price) product.price = price;
    if (priceType) product.priceType = priceType;
    if (category) product.category = category;
    if (location) product.location = location;
    
    // Handle status change
    if (status && status !== product.status) {
      product.status = status;
      
      if (status === 'approved') {
        product.approvedAt = new Date();
        product.isActive = true;
        product.approvalMessage = 'Product approved by admin';
      } else if (status === 'rejected') {
        product.isActive = false;
        product.approvalMessage = req.body.rejectionReason || 'Product rejected by admin';
      } else if (status === 'sold') {
        product.isActive = false;
        product.soldAt = new Date();
      }
    }
    
    await product.save();
    
    res.json({
      success: true,
      message: 'Product updated successfully',
      product: {
        id: product._id,
        title: product.title,
        status: product.status,
        updatedAt: product.updatedAt
      }
    });
    
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product'
    });
  }
};

// @desc    Delete product (admin)
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Decrement user's post count
    await User.findByIdAndUpdate(product.postedBy, {
      $inc: { postCount: -1 }
    });
    
    // Delete product
    await product.deleteOne();
    
    res.json({
      success: true,
      message: 'Product deleted successfully',
      productId: product._id
    });
    
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product'
    });
  }
};

// @desc    Get all inquiries
// @route   GET /api/admin/inquiries
// @access  Private/Admin
exports.getAllInquiries = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    const matchStage = { 'inquiries.0': { $exists: true } };
    if (status && status !== 'all') {
      matchStage['inquiries.status'] = status;
    }
    
    const skip = (Number(page) - 1) * Number(limit);
    
    // Get inquiries with pagination
    const products = await Product.aggregate([
      { $match: matchStage },
      { $unwind: '$inquiries' },
      { $match: status && status !== 'all' ? { 'inquiries.status': status } : {} },
      { $sort: { 'inquiries.inquiredAt': -1 } },
      { $skip: skip },
      { $limit: Number(limit) },
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
          brokerPhone: '$postedBy.phone',
          buyerName: '$inquiries.buyerName',
          buyerEmail: '$inquiries.buyerEmail',
          buyerPhone: '$inquiries.buyerPhone',
          message: '$inquiries.message',
          status: '$inquiries.status',
          inquiredAt: '$inquiries.inquiredAt'
        }
      }
    ]);
    
    // Get total count
    const totalResult = await Product.aggregate([
      { $match: { 'inquiries.0': { $exists: true } } },
      { $unwind: '$inquiries' },
      { $match: status && status !== 'all' ? { 'inquiries.status': status } : {} },
      { $count: 'total' }
    ]);
    
    const total = totalResult[0]?.total || 0;
    
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
    
    res.json({
      success: true,
      count: products.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: Number(page),
      filters: {
        statusCounts
      },
      inquiries: products
    });
    
  } catch (error) {
    console.error('Get inquiries error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching inquiries'
    });
  }
};

// @desc    Update inquiry status
// @route   PUT /api/admin/inquiries/:inquiryId
// @access  Private/Admin
exports.updateInquiryStatus = async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const { inquiryId } = req.params;
    
    if (!['new', 'contacted', 'closed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Use: new, contacted, or closed'
      });
    }
    
    // Find product containing this inquiry
    const product = await Product.findOne({
      'inquiries._id': inquiryId
    });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }
    
    // Update inquiry status
    const inquiry = product.inquiries.id(inquiryId);
    inquiry.status = status;
    inquiry.adminNote = adminNote;
    inquiry.updatedAt = new Date();
    
    await product.save();
    
    res.json({
      success: true,
      message: `Inquiry marked as ${status}`,
      inquiry: {
        id: inquiry._id,
        buyerName: inquiry.buyerName,
        buyerEmail: inquiry.buyerEmail,
        status: inquiry.status,
        productTitle: product.title,
        updatedAt: inquiry.updatedAt
      }
    });
    
  } catch (error) {
    console.error('Update inquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating inquiry'
    });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
  try {
    // Today's date range
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const endOfToday = new Date(today.setHours(23, 59, 59, 999));
    
    // Last 7 days
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    const [
      totalProducts,
      pendingProducts,
      approvedProducts,
      soldProducts,
      totalUsers,
      todayUsers,
      todayProducts,
      todayInquiries,
      totalInquiries,
      newInquiries
    ] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ status: 'pending' }),
      Product.countDocuments({ status: 'approved', isActive: true }),
      Product.countDocuments({ status: 'sold' }),
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: startOfToday } }),
      Product.countDocuments({ createdAt: { $gte: startOfToday } }),
      Product.countDocuments({ 
        'inquiries.inquiredAt': { $gte: startOfToday } 
      }),
      Product.aggregate([
        { $unwind: '$inquiries' },
        { $count: 'total' }
      ]),
      Product.aggregate([
        { $unwind: '$inquiries' },
        { $match: { 'inquiries.status': 'new' } },
        { $count: 'total' }
      ])
    ]);
    
    // Products by category
    const productsByCategory = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    // Recent activities
    const recentProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('postedBy', 'name')
      .select('title status price category createdAt');
    
    const recentInquiries = await Product.aggregate([
      { $unwind: '$inquiries' },
      { $sort: { 'inquiries.inquiredAt': -1 } },
      { $limit: 5 },
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
          productId: '$_id',
          productTitle: '$title',
          brokerName: '$postedBy.name',
          buyerName: '$inquiries.buyerName',
          buyerEmail: '$inquiries.buyerEmail',
          status: '$inquiries.status',
          inquiredAt: '$inquiries.inquiredAt'
        }
      }
    ]);
    
    // Weekly product trends
    const weeklyProducts = await Product.aggregate([
      {
        $match: {
          createdAt: { $gte: lastWeek }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 7 }
    ]);
    
    res.json({
      success: true,
      stats: {
        products: {
          total: totalProducts,
          pending: pendingProducts,
          approved: approvedProducts,
          sold: soldProducts,
          today: todayProducts
        },
        users: {
          total: totalUsers,
          today: todayUsers
        },
        inquiries: {
          total: totalInquiries[0]?.total || 0,
          new: newInquiries[0]?.total || 0,
          today: todayInquiries
        },
        categories: productsByCategory,
        weeklyTrends: weeklyProducts
      },
      recentActivities: {
        products: recentProducts,
        inquiries: recentInquiries
      }
    });
    
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics'
    });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const { 
      role, 
      search, 
      page = 1, 
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    // Build filter
    const filter = {};
    
    if (role && role !== 'all') {
      filter.role = role;
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    // Sort
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const users = await User.find(filter)
      .select('-password')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));
    
    const total = await User.countDocuments(filter);
    
    // Get user stats
    const userStats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.json({
      success: true,
      count: users.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: Number(page),
      filters: {
        userStats
      },
      users: users.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        postCount: user.postCount,
        isActive: user.isActive,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }))
    });
    
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users'
    });
  }
};

// @desc    Update user (admin)
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res) => {
  try {
    const { role, isActive } = req.body;
    const userId = req.params.id;
    
    // Check if trying to update self
    if (userId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot update your own account'
      });
    }
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Update fields
    if (role && ['user', 'admin'].includes(role)) {
      user.role = role;
    }
    
    if (typeof isActive === 'boolean') {
      user.isActive = isActive;
    }
    
    await user.save();
    
    res.json({
      success: true,
      message: 'User updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        updatedAt: user.updatedAt
      }
    });
    
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user'
    });
  }
};