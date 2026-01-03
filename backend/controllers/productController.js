const Product = require('../models/Product');
const User = require('../models/User');
const { uploadProductImages } = require('../middleware/upload');
const { cloudinary } = require('../config/cloudinary');


// @desc    Create product (ALL registered users can post)
// @route   POST /api/products
// @access  Private (any authenticated user)
exports.createProduct = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Please login to post products'
      });
    }

    // Determine product status based on role
    let status = 'pending';
    let approvalMessage = 'Your product is under review. It will be approved within 24 hours.';
    
    if (req.user.role === 'admin') {
      status = 'approved';
      approvalMessage = 'Product approved automatically as admin.';
    }

    // Get image URLs from Cloudinary
    const images = req.files.map(file => file.path);

    // Create product
    const product = await Product.create({
      ...req.body,
      images: images,
      postedBy: req.user.id,
      status: status,
      approvalMessage: approvalMessage
    });

    // Increment user's post count
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { postCount: 1 }
    });

    res.status(201).json({
      success: true,
      message: req.user.role === 'admin' 
        ? 'Product created and approved successfully' 
        : 'Product submitted for approval',
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
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (!product.postedBy) {
      return res.status(500).json({ success: false, message: 'Product missing postedBy field' });
    }

    if (product.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
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
    res.status(500).json({ success: false, message: 'Error marking product as sold', error: error.message });
  }
};


// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('postedBy', 'name email phone postCount createdAt')
      .populate('likes', 'name')
      .populate('favorites', 'name');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Increment view count (only for public views)
    // You might want to track unique views per user
    product.views = (product.views || 0) + 1;
    await product.save();
    
    // Check if user has liked/favorited this product
    let isLiked = false;
    let isFavorited = false;
    
    if (req.user) {
      isLiked = product.likes.some(like => like._id.toString() === req.user.id);
      
      const user = await User.findById(req.user.id).select('favorites');
      isFavorited = user.favorites.some(favId => favId.toString() === product._id.toString());
    }
    
    // Get similar products (optional)
    const similarProducts = await Product.find({
      _id: { $ne: product._id }, // Exclude current product
      category: product.category,
      status: 'approved',
      isActive: true
    })
    .limit(4)
    .select('title price images location')
    .sort({ createdAt: -1 });
    
    // Format response
    const response = {
      success: true,
      product: {
        id: product._id,
        title: product.title,
        description: product.description,
        fullDescription: product.description, // For compatibility with your frontend
        price: product.price,
        priceType: product.priceType || 'Fixed',
        negotiable: product.negotiable || false,
        category: product.category,
        location: product.location,
        images: product.images,
        brand: product.brand,
        model: product.model,
        year: product.year,
        condition: product.condition,
        postedBy: {
          id: product.postedBy._id,
          name: product.postedBy.name,
          email: product.postedBy.email,
          phone: product.postedBy.phone,
          postCount: product.postedBy.postCount,
          memberSince: product.postedBy.createdAt
        },
        likes: product.likes.length,
        favorites: product.favorites.length,
        shares: product.shares || 0,
        views: product.views,
        status: product.status,
        isLiked,
        isFavorited,
        isActive: product.isActive,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      },
      similarProducts: similarProducts.map(p => ({
        id: p._id,
        title: p.title,
        price: p.price,
        image: p.images[0],
        location: p.location
      }))
    };
    
    // If product is not approved and user is not admin/owner, hide details
    if (product.status !== 'approved' && product.status !== 'sold') {
      if (!req.user || (req.user.id !== product.postedBy._id.toString() && req.user.role !== 'admin')) {
        return res.status(403).json({
          success: false,
          message: product.approvalMessage || 'This product is under review',
          product: {
            id: product._id,
            title: product.title,
            status: product.status,
            approvalMessage: product.approvalMessage,
            createdAt: product.createdAt
          }
        });
      }
    }
    
    res.json(response);
    
  } catch (error) {
    console.error('Get product by ID error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Owner or Admin)
exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Check ownership
    if (product.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this product'
      });
    }
    
    // Update product
    product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, status: 'pending' }, // Reset to pending after update
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      message: 'Product updated and sent for re-approval',
      product: {
        id: product._id,
        title: product.title,
        status: product.status,
        approvalMessage: 'Product updated and is under review again'
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

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Owner or Admin)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Check ownership
    if (product.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this product'
      });
    }
    
    // Delete images from Cloudinary
    if (product.images && product.images.length > 0) {
      for (const imageUrl of product.images) {
        const publicId = imageUrl.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }
    }
    
    // Delete product
    await product.deleteOne();
    
    // Decrement user's post count
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { postCount: -1 }
    });
    
    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product'
    });
  }
};


// @route   GET /api/products/user/my-products
// @access  Private
// productsController.js
exports.getProductsByUser = async (req, res) => {
  try {
    // Use req.user.id to get current user's products
    const products = await Product.find({ postedBy: req.user.id })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: products.length,
      products: products.map(product => ({
        id: product._id,
        title: product.title,
        price: product.price,
        images: product.images,
        status: product.status,
        views: product.views,
        likes: product.likes.length,
        favorites: product.favorites.length,
        createdAt: product.createdAt
      }))
    });
  } catch (error) {
    console.error('Get user products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching your products'
    });
  }
};

// NEW: Get current user's products
exports.getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ postedBy: req.user.id })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: products.length,
      products: products.map(product => ({
        id: product._id,
        title: product.title,
        price: product.price,
        images: product.images,
        status: product.status,
        views: product.views,
        likes: product.likes.length,
        favorites: product.favorites.length,
        createdAt: product.createdAt
      }))
    });
  } catch (error) {
    console.error('Get my products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching your products'
    });
  }
};