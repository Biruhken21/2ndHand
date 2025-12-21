const Product = require('../models/Product');
const User = require('../models/User');
const Notification = require('../models/Notification');
const Inquiry = require('../models/Inquiry');

// 1. CONTACT SELLER (Send inquiry)
// Update your contactSeller controller to accept optional user info
exports.contactSeller = async (req, res) => {
  try {
    const { productId } = req.params;
    const { message, name, email, phone } = req.body; // Add these
    const userId = req.user.id;

    // Basic validation
    if (!message || message.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: 'Message must be at least 5 characters'
      });
    }

    // Find product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Get buyer info - use updated info from request if provided
    let buyer = await User.findById(userId).select('name email phone');
    
    // Use updated info from request if provided
    const buyerName = name && name.trim() ? name.trim() : buyer.name;
    const buyerEmail = email && email.trim() ? email.trim() : buyer.email;
    const buyerPhone = phone && phone.trim() ? phone.trim() : buyer.phone;
    
    // Validate buyer has phone
    if (!buyerPhone) {
      return res.status(400).json({
        success: false,
        message: 'Please add your phone number to your profile before contacting sellers'
      });
    }
    
    // Prevent contacting yourself
    if (product.postedBy.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot contact yourself'
      });
    }

    // Create inquiry in separate collection
    const inquiry = await Inquiry.create({
      buyerId: userId,
      sellerId: product.postedBy,
      productId: product._id,
      buyerName: buyerName,
      buyerEmail: buyerEmail,
      buyerPhone: buyerPhone,
      message: message.trim(),
      status: 'new'
    });

    // Notify seller
    await Notification.create({
      user: product.postedBy,
      type: 'new_inquiry',
      title: 'New Inquiry',
      message: `${buyerName} is interested in your product "${product.title}"`,
      data: {
        productId: product._id,
        buyerId: userId,
        inquiryId: inquiry._id
      }
    });

    res.json({
      success: true,
      message: 'Message sent successfully',
      inquiryId: inquiry._id
    });
  } catch (error) {
    console.error('Contact seller error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending message'
    });
  }
};

// 2. GET CONTACTED PRODUCTS (User's sent inquiries)
exports.getContactedProducts = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find inquiries sent by this user
    const inquiries = await Inquiry.find({ buyerId: userId })
      .populate({
        path: 'productId',
        match: { 
          status: 'approved',
          isActive: true 
        },
        select: 'title price category location images' // Removed postedBy
      })
      .sort({ createdAt: -1 });
    
    // Filter out inquiries where product was not found (null) or doesn't match criteria
    const validInquiries = inquiries.filter(inquiry => inquiry.productId);
    
    // Format response - only product info, no seller details
    const contactedProducts = validInquiries.map(inquiry => {
      const product = inquiry.productId;
      
      return {
        product: {
          id: product._id,
          title: product.title,
          price: product.price,
          category: product.category,
          location: product.location,
          image: product.images[0]
          // Removed postedBy object
        },
        inquiry: {
          id: inquiry._id,
          message: inquiry.message,
          status: inquiry.status,
          date: inquiry.createdAt,
          buyerPhone: inquiry.buyerPhone,
          buyerEmail: inquiry.buyerEmail
        }
      };
    });

    res.json({
      success: true,
      count: contactedProducts.length,
      products: contactedProducts
    });
  } catch (error) {
    console.error('Get contacted products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching your contacts'
    });
  }
};