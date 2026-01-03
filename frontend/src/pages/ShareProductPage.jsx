import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin,
  MessageCircle,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
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
  };

  const nextImage = () => {
    if (!product?.images?.length) return;
    setCurrentImageIndex(prev => prev === product.images.length - 1 ? 0 : prev + 1);
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  // Error State
  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Product Not Found</h2>
        <p className="text-gray-600 mb-6">{error || 'Product no longer available'}</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Browse Products
        </button>
      </div>
    );
  }

  // Success State - Product exists
  const images = product.images || [];
  const priceType = product.priceType || 'Fixed';
  const description = product.description || 'No description available.';
  const isSold = product.status === 'sold';

  return (
    <>
      <Helmet>
        <title>{`${product.title} - $${product.price}`}</title>
        <meta name="description" content={`${description.substring(0, 160)}`} />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <div className="flex justify-between items-center">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="md:flex">
              {/* Images */}
              <div className="md:w-1/2 p-4">
                <div className="relative h-80 md:h-96 rounded-lg overflow-hidden bg-gray-100">
                  {images.length > 0 ? (
                    <>
                      <img
                        src={images[currentImageIndex]}
                        alt={product.title}
                        className="w-full h-full object-contain"
                      />
                      
                      {isSold && (
                        <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1.5 rounded font-bold">
                          SOLD
                        </div>
                      )}
                      
                      {images.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                          
                          {/* Image Counter */}
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                            {currentImageIndex + 1} / {images.length}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No image
                    </div>
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="md:w-1/2 p-4 md:p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.title}</h1>
                
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-blue-600">
                    ${product.price}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    priceType === 'Negotiable' 
                      ? 'bg-orange-100 text-orange-700' 
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {priceType}
                  </span>
                </div>

                {/* Location */}
                {product.location && (
                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <MapPin className="w-4 h-4" />
                    <span>{product.location}</span>
                  </div>
                )}

                {/* Description */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700 whitespace-pre-line">
                    {description}
                  </p>
                </div>

                {/* Contact Button */}
                <button
                  onClick={handleContact}
                  disabled={isContactLoading || isSold}
                  className={`w-full py-3 rounded-lg font-medium transition ${
                    isSold
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
                  }`}
                >
                  {isContactLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Redirecting...</span>
                    </div>
                  ) : isSold ? (
                    <div className="flex items-center justify-center gap-2">
                      <Check className="w-4 h-4" />
                      Product Sold
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      Register to Contact Seller
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductPage;