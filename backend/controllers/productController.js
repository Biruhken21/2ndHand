const Product = require('../models/Product');
const User = require('../models/User');
const { uploadProductImages } = require('../middleware/upload');
const { cloudinary } = require('../config/cloudinary');


// @desc    Create product (ALL registered users can post)
// @route   POST /api/products
// @access  Private (any authenticated user)
exports.createProduct = async (req, res) => {
  try {
    // Check if user is authenticated (any user can post)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Please login to post products'
      });
    }
    
    // Get image URLs from Cloudinary
    // Note: Files are already uploaded by uploadProductImages middleware
    const images = req.files.map(file => file.path);
    
    // Create product
    const product = await Product.create({
      ...req.body,
      images: images,
      postedBy: req.user.id, // REQUIRED field
      status: 'pending',
      approvalMessage: 'Your product is under review. It will be approved within 24 hours.'
    });
    
    // Increment user's post count
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { postCount: 1 }
    });
    
    res.status(201).json({
      success: true,
      message: 'Product submitted for approval',
      product: {
        id: product._id,
        title: product.title,
        status: product.status,
        approvalMessage: product.approvalMessage,
        images: product.images,
        createdAt: product.createdAt
      }
    });
    
  } catch (error) {
    console.error('Create product error:', error);
    
    // Delete uploaded images if error occurs
    if (req.files) {
      req.files.forEach(file => {
        const publicId = file.filename;
        cloudinary.uploader.destroy(publicId);
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
};

// @desc    Get approved products for users
// @route   GET /api/products
// @access  Public
exports.getApprovedProducts = async (req, res) => {
  try {
    const { category, priceMin, priceMax, location, page = 1, limit = 12 } = req.query;
    
    // Build filter - only approved and active products
    const filter = {
      status: 'approved',
      isActive: true
    };
    
    // Apply filters
    if (category) filter.category = category;
    if (location) filter.location = new RegExp(location, 'i');
    if (priceMin || priceMax) {
      filter.price = {};
      if (priceMin) filter.price.$gte = Number(priceMin);
      if (priceMax) filter.price.$lte = Number(priceMax);
    }
    
    // Pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    const products = await Product.find(filter)
      .populate('postedBy', 'name postCount')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    
    const total = await Product.countDocuments(filter);
    
    // Check user's likes and favorites if logged in
    let userLikes = [];
    let userFavorites = [];
    
    if (req.user) {
      const user = await User.findById(req.user.id).select('favorites');
      userFavorites = user.favorites || [];
      
      // Get user's liked products
      const likedProducts = await Product.find({
        '_id': { $in: products.map(p => p._id) },
        'likes': req.user.id
      }).select('_id');
      
      userLikes = likedProducts.map(p => p._id.toString());
    }
    
    res.json({
      success: true,
      count: products.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: Number(page),
      products: products.map(product => ({
        id: product._id,
        title: product.title,
        description: product.description.length > 150 
          ? product.description.substring(0, 150) + '...' 
          : product.description,
        fullDescription: product.description,
        price: product.price,
        priceType: product.priceType,
        category: product.category,
        location: product.location,
        images: product.images,
        postedBy: {
          id: product.postedBy._id,
          name: product.postedBy.name,
          postCount: product.postedBy.postCount
        },
        likes: product.likes.length,
        favorites: product.favorites.length,
        shares: product.shares,
        views: product.views,
        isLiked: userLikes.includes(product._id.toString()),
        isFavorited: userFavorites.includes(product._id.toString()),
        status: product.status,
        createdAt: product.createdAt
      }))
    });
    
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products'
    });
  }
};

// @desc    Mark product as sold
// @route   PUT /api/products/:id/sold
// @access  Private (User who posted it)
exports.markAsSold = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Check if user is the one who posted this product or admin
    if (product.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to mark this product as sold'
      });
    }
    
    product.status = 'sold';
    product.isActive = false;
    product.soldAt = new Date();
    
    await product.save();
    
    res.json({
      success: true,
      message: 'Product marked as sold',
      product: {
        id: product._id,
        title: product.title,
        status: product.status,
        soldAt: product.soldAt
      }
    });
    
  } catch (error) {
    console.error('Mark as sold error:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking product as sold'
    });
  }
};