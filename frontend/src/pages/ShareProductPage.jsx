import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Eye,
  MessageCircle,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Shield,
  Check
} from 'lucide-react';
import { productAPI } from '/src/services/authAPI';
import { Helmet } from 'react-helmet-async';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isContactLoading, setIsContactLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productAPI.getProductById(id);
        
        if (response.success) {
          setProduct(response.product);
        } else {
          setError(response.message || 'Failed to load product');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Redirect to register when clicking contact
  const handleContact = () => {
    if (!product) return;
    
    setIsContactLoading(true);
    navigate('/register', { 
      state: { 
        fromProduct: true,
        productId: product.id,
        productTitle: product.title
      } 
    });
  };

  // Image navigation
  const prevImage = () => {
    if (!product?.images?.length) return;
    setCurrentImageIndex(prev => prev === 0 ? product.images.length - 1 : prev - 1);
    setImageLoaded(false);
  };

  const nextImage = () => {
    if (!product?.images?.length) return;
    setCurrentImageIndex(prev => prev === product.images.length - 1 ? 0 : prev + 1);
    setImageLoaded(false);
  };

  // Loading State
  if (loading) {
    return (
      <>
        <Helmet>
          <title>{"Loading Product..."}</title>
          <meta name="description" content={"Product details are loading..."} />
        </Helmet>
        <div className="min-h-screen pt-20 flex items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto" />
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </>
    );
  }

  // Error State
  if (error || !product) {
    return (
      <>
        <Helmet>
          <title>{"Product Not Found"}</title>
          <meta name="description" content={"This product is not available."} />
        </Helmet>
        <div className="min-h-screen pt-20 flex items-center justify-center p-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'Product no longer available'}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
          >
            Browse Products
          </button>
        </div>
      </>
    );
  }

  // Success State - Product exists
  const images = product.images || [];
  const priceType = product.priceType || 'Fixed';
  const description = product.description || 'No description available.';
  const isSold = product.status === 'sold';
  const mainImage = images[0] || '';

  return (
    <>
      {/* Meta Tags for Social Media Sharing */}
      <Helmet>
        {/* Basic Meta */}
        <title>{`${product.title} - $${product.price}`}</title>
        <meta name="description" content={`${description.substring(0, 160)}`} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="product" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:title" content={`${product.title} - $${product.price}`} />
        <meta property="og:description" content={`${description.substring(0, 160)}`} />
        {mainImage && <meta property="og:image" content={mainImage} />}
        {mainImage && <meta property="og:image:width" content="1200" />}
        {mainImage && <meta property="og:image:height" content="630" />}
        <meta property="product:price:amount" content={product.price} />
        <meta property="product:price:currency" content="USD" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${product.title} - $${product.price}`} />
        <meta name="twitter:description" content={`${description.substring(0, 160)}`} />
        {mainImage && <meta name="twitter:image" content={mainImage} />}
      </Helmet>

      {/* Page Content - Centered Design */}
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Header - Centered */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back to Products</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content - Centered Container */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Product Card - Centered with beautiful design */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 transition-all duration-300 hover:shadow-2xl">
            <div className="md:flex">
              {/* Left: Images Gallery - Centered */}
              <div className="md:w-1/2 p-6 md:p-8">
                <div className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
                  {images.length > 0 ? (
                    <>
                      {!imageLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
                        </div>
                      )}
                      
                      <img
                        src={images[currentImageIndex]}
                        alt={product.title}
                        className="w-full h-full object-contain transition-opacity duration-300"
                        onLoad={() => setImageLoaded(true)}
                        style={{ opacity: imageLoaded ? 1 : 0 }}
                      />
                      
                      {isSold && (
                        <div className="absolute top-6 left-6 bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-2.5 rounded-lg font-bold shadow-xl transform -rotate-3">
                          <span className="flex items-center gap-2">
                            <Check className="w-4 h-4" />
                            SOLD
                          </span>
                        </div>
                      )}
                      
                      {/* Image Navigation */}
                      {images.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-2xl flex items-center justify-center hover:scale-110 transition-all hover:bg-white"
                          >
                            <ChevronLeft className="w-6 h-6 text-gray-800" />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-2xl flex items-center justify-center hover:scale-110 transition-all hover:bg-white"
                          >
                            <ChevronRight className="w-6 h-6 text-gray-800" />
                          </button>
                          
                          {/* Image Counter */}
                          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-lg">
                            {currentImageIndex + 1} / {images.length}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                      <div className="text-6xl mb-4">📷</div>
                      <p className="text-lg">No image available</p>
                    </div>
                  )}
                </div>
                
                {/* Thumbnails - Centered */}
                {images.length > 1 && (
                  <div className="flex justify-center gap-3 mt-6 py-2">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setCurrentImageIndex(idx);
                          setImageLoaded(false);
                        }}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                          idx === currentImageIndex 
                            ? 'border-blue-500 scale-105 shadow-lg' 
                            : 'border-gray-200 hover:border-gray-300 hover:scale-102'
                        }`}
                      >
                        <img 
                          src={img} 
                          alt={`Thumbnail ${idx + 1}`} 
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Product Details - Beautiful Design */}
              <div className="md:w-1/2 p-6 md:p-8 border-t md:border-t-0 md:border-l border-gray-100">
                {/* Title and Price - Centered Header */}
                <div className="text-center md:text-left mb-8">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 rounded-full mb-4">
                    <span className="text-sm font-medium text-blue-700">{product.category || "General"}</span>
                  </div>
                  
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                    {product.title}
                  </h1>
                  
                  <div className="flex flex-col md:flex-row md:items-center gap-4 justify-center md:justify-start">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        ${product.price}
                      </span>
                      <span className={`px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm ${
                        priceType === 'Negotiable' 
                          ? 'bg-gradient-to-r from-orange-100 to-amber-100 text-amber-700 border border-amber-200' 
                          : 'bg-gradient-to-r from-green-100 to-emerald-100 text-emerald-700 border border-emerald-200'
                      }`}>
                        {priceType}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stats - Beautiful Cards */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {product.views && (
                    <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Eye className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Views</p>
                          <p className="text-lg font-bold text-gray-900">{product.views}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {product.createdAt && (
                    <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Calendar className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Posted</p>
                          <p className="text-lg font-bold text-gray-900">
                            {new Date(product.createdAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Location Card */}
                {product.location && (
                  <div className="mb-8 p-5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white rounded-xl shadow-sm">
                        <MapPin className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-blue-800 mb-1">📍 Location</p>
                        <p className="text-gray-800 font-medium">{product.location}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Description - Beautiful Card */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1.5 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                    <h3 className="text-xl font-bold text-gray-900">Description</h3>
                  </div>
                  <div className="bg-gradient-to-b from-white to-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed text-base">
                      {description}
                    </p>
                  </div>
                </div>

                {/* Contact Button - Centered & Beautiful */}
                <div className="mb-8">
                  <button
                    onClick={handleContact}
                    disabled={isContactLoading || isSold}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:-translate-y-1 ${
                      isSold
                        ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-xl hover:shadow-2xl'
                    }`}
                  >
                    {isContactLoading ? (
                      <div className="flex items-center justify-center gap-3">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Redirecting...</span>
                      </div>
                    ) : isSold ? (
                      <span className="flex items-center justify-center gap-2">
                        <Check className="w-5 h-5" />
                        Product Sold
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-3">
                        <MessageCircle className="w-5 h-5" />
                        Register to Contact Seller
                      </span>
                    )}
                  </button>
                  
                  {!isSold && (
                    <p className="text-center text-gray-600 mt-3 text-sm">
                      Create an account to contact the seller securely
                    </p>
                  )}
                </div>

                {/* Safety Tips - Beautiful Design */}
                <div className="p-5 rounded-xl bg-gradient-to-r from-yellow-50 to-amber-50 border border-amber-100">
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-amber-100 rounded-lg">
                      <Shield className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                        🔒 Safety First
                      </h4>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-amber-700">Always meet in public places</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-amber-700">Inspect products before payment</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-amber-700">Avoid advance payments</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Simple Call to Action - Clean & Centered */}
          <div className="text-center">
            <button
              onClick={() => navigate('/')}
              className="px-8 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl font-semibold hover:from-gray-900 hover:to-black transition-all duration-300 shadow-lg"
            >
              ← Browse More Products
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductPage;