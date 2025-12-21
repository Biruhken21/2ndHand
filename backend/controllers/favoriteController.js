const Product = require('../models/Product');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Toggle favorite
exports.toggleFavorite = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const user = await User.findById(userId);
    const isFavorited = user.favorites.includes(productId);

    if (isFavorited) {
      // Remove favorite
      user.favorites.pull(productId);
      product.favorites.pull(userId);
      await user.save();
      await product.save();

      res.json({
        success: true,
        isFavorited: false,
        favoritesCount: product.favorites.length
      });
    } else {
      // Add favorite
      user.favorites.push(productId);
      product.favorites.push(userId);
      await user.save();
      await product.save();

      // Notify seller if not favoriting own product
      if (product.postedBy.toString() !== userId) {
        await Notification.create({
          user: product.postedBy,
          type: 'product_favorited',
          title: 'Product Favorited',
          message: `${req.user.name} liked your product "${product.title}"`
        });
      }

      res.json({
        success: true,
        isFavorited: true,
        favoritesCount: product.favorites.length
      });
    }
  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating favorite'
    });
  }
};

// Get user's favorites
exports.getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId).populate({
      path: 'favorites',
      match: { status: 'approved', isActive: true },
      populate: {
        path: 'postedBy',
        select: 'name'
      }
    });

    const favorites = user.favorites.map(product => ({
      id: product._id,
      title: product.title,
      price: product.price,
      category: product.category,
      location: product.location,
      image: product.images[0],
      postedBy: {
        id: product.postedBy._id,
        name: product.postedBy.name
      }
    }));

    res.json({
      success: true,
      count: favorites.length,
      favorites
    });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching favorites'
    });
  }
};

// Check favorite status
exports.checkFavoriteStatus = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId);
    const isFavorited = user.favorites.includes(productId);

    res.json({
      success: true,
      isFavorited
    });
  } catch (error) {
    console.error('Check favorite error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking favorite status'
    });
  }
};