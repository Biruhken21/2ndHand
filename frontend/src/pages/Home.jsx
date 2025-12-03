import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Truck, Shield, Star, ArrowRight, Search } from 'lucide-react';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const features = [
    {
      icon: <ShoppingBag className="h-8 w-8" />,
      title: "Easy Shopping",
      description: "Browse thousands of products with our intuitive interface",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <Truck className="h-8 w-8" />,
      title: "Fast Delivery",
      description: "Get your orders delivered within 24 hours in major cities",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure Payments",
      description: "100% secure payment methods with end-to-end encryption",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: <Star className="h-8 w-8" />,
      title: "Premium Quality",
      description: "All products are verified for quality and authenticity",
      color: "from-orange-500 to-red-500",
    },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      // Implement search functionality here
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section with Search */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-5"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Discover Amazing
              </span>
              <br />
              <span className="text-gray-900">Products</span>
            </h1>
            
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              Find everything you need with our powerful search and curated collections
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mt-10 max-w-2xl mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products, brands, or categories..."
                  className="w-full pl-12 pr-4 py-4 text-lg rounded-2xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500 shadow-lg transition-all duration-200"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                >
                  Search
                </button>
              </div>
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                <span className="text-sm text-gray-500">Popular searches:</span>
                {['Electronics', 'Fashion', 'Home Decor', 'Books', 'Fitness'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSearchQuery(tag)}
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors duration-200"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </form>
            
            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-xl text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
              >
                Browse All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-xl text-purple-600 bg-white border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200"
              >
                Join Free
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Why Shop With Us?
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Experience shopping like never before with our premium features
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div
                className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <div className="text-white">
                  {feature.icon}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {feature.title}
              </h3>
              
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl mx-4 md:mx-8 lg:mx-auto max-w-7xl p-8 md:p-12 my-16">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-purple-100 max-w-2xl">
              Join thousands of satisfied customers who trust UserProduct for 
              their shopping needs.
            </p>
          </div>
          
          <div className="mt-6 md:mt-0">
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-xl text-purple-600 bg-white hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              Create Free Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;