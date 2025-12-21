const Product = require('../models/Product');

// Increment share count
exports.incrementShare = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findByIdAndUpdate(
      productId,
      { $inc: { shares: 1 } },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      shares: product.shares
    });
  } catch (error) {
    console.error('Share error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sharing product'
    });
  }
};