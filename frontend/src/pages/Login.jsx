import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Facebook, Github, Twitter, User } from 'lucide-react';
import { authAPI } from '/src/services/authAPI.js';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setErrors({});

    if (!validateForm()) {
      return;
    }
    setIsLoading(true);

    try {
      // Call the login API
      const response = await authAPI.login(formData);
      
      console.log('Login response:', response); // For debugging
      
      // Handle different response structures from backend
      let token, userData;
      
      // Check for different response formats
      if (response.token) {
        // Format: { token, user }
        token = response.token;
        userData = response.user;
      } else if (response.data && response.data.token) {
        // Format: { data: { token, user } }
        token = response.data.token;
        userData = response.data.user;
      } else if (response.access_token) {
        // Format: { access_token, user }
        token = response.access_token;
        userData = response.user;
      }
      
      if (!token) {
        throw new Error('No authentication token received from server');
      }
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Store user data if available
      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
      }
      
      // Store token timestamp for expiration handling
      localStorage.setItem('token_timestamp', new Date().getTime().toString());
      
      // Show success message
      console.log('Login successful! Token saved.');
      
      // Optional: Show toast notification
      // toast.success('Login successful!');
      
      // Redirect to dashboard or home page
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle different error formats
      let errorMessage = 'Login failed. Please try again.';
      
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error.message) {
        errorMessage = error.message;
        
        // Common error messages from backend
        if (errorMessage.includes('Invalid credentials') || 
            errorMessage.includes('invalid') || 
            errorMessage.includes('incorrect')) {
          errorMessage = 'Invalid email or password';
        } else if (errorMessage.includes('not found') || 
                  errorMessage.includes('User does not exist')) {
          errorMessage = 'No account found with this email';
        } else if (errorMessage.includes('Network Error') || 
                  errorMessage.includes('timeout') || 
                  errorMessage.includes('Failed to fetch')) {
          errorMessage = 'Cannot connect to server. Please check your connection.';
        }
      }
      
      setApiError(errorMessage);
      
      // Clear password for security
      setFormData(prev => ({ ...prev, password: '' }));
      
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
    if (apiError) {
      setApiError('');
    }
  };

  // Test backend connection
  const testBackendConnection = async () => {
    try {
      const response = await authAPI.test();
      alert(`✅ Backend is working!\nMessage: ${response.message || 'Connected successfully!'}`);
    } catch (error) {
      alert(`❌ Backend connection failed!\nError: ${error}\n\nMake sure:\n1. Backend server is running on port 5000\n2. CORS is enabled on backend\n3. Network connection is stable`);
    }
  };

  // Demo login for testing
  const handleDemoLogin = () => {
    // Pre-fill with demo credentials
    setFormData({
      email: 'demo@example.com',
      password: 'demo123'
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          {/* Header Section */}
          <div className="p-8 text-center bg-gradient-to-r from-purple-600 to-blue-600 relative">
            <div className="absolute top-4 right-4">
              <button
                onClick={testBackendConnection}
                className="text-xs bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full transition-colors duration-200"
              >
                Test Backend
              </button>
            </div>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 shadow-lg">
              <User className="h-8 w-8 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome Back
            </h1>
            <p className="text-purple-100">Sign in to your account to continue</p>
          </div>

          <div className="px-8 pb-8 pt-6">
            {/* API Error Message */}
            {apiError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{apiError}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Social Login Buttons */}
            <div className="mb-8">
              <div className="flex justify-center space-x-4 mb-4">
                <button 
                  type="button"
                  className="p-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors duration-200 border border-blue-100"
                >
                  <Facebook className="h-5 w-5 text-blue-600" />
                </button>
                <button 
                  type="button"
                  className="p-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors duration-200 border border-blue-100"
                >
                  <Twitter className="h-5 w-5 text-blue-400" />
                </button>
                <button 
                  type="button"
                  className="p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200 border border-gray-100"
                >
                  <Github className="h-5 w-5 text-gray-800" />
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with email</span>
                </div>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`pl-10 w-full px-4 py-3 rounded-xl border ${
                      errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200`}
                    placeholder="you@example.com"
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`pl-10 pr-10 w-full px-4 py-3 rounded-xl border ${
                      errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200`}
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-purple-600 transition-colors duration-200"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    disabled={isLoading}
                  />
                  <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-purple-600 hover:text-purple-500 transition-colors duration-200"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium py-3 px-4 rounded-xl hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>

              {/* Demo Login Button */}
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium py-3 px-4 rounded-xl hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Try Demo Credentials
              </button>
            </form>

            {/* Debug Info (Remove in production) */}
            <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Debug Info:</h3>
              <div className="text-xs text-gray-600 space-y-1">
                <div>Backend: http://localhost:5000/api</div>
                <div>Token stored: {localStorage.getItem('token') ? 'Yes' : 'No'}</div>
                <div>User stored: {localStorage.getItem('user') ? 'Yes' : 'No'}</div>
              </div>
            </div>

            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-medium text-purple-600 hover:text-purple-500 transition-colors duration-200"
                >
                  Sign up now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;