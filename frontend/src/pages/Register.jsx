import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Lock, Check } from 'lucide-react';
import { authAPI } from '/src/services/authAPI.js';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
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
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.terms) {
      newErrors.terms = 'You must accept the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setSuccess('');
    setErrors({});
    
    if (!validateForm()) return;
    
    setIsLoading(true);

    try {
      // Prepare data for backend
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password
      };
      
      console.log('Sending registration request:', {
        url: 'http://localhost:5000/api/auth/register',
        data: { ...userData, password: '••••••••' } // Hide password in log
      });
      
      // Call the register API
      const response = await authAPI.register(userData);
      
      console.log('Registration response:', response);
      
      // Handle response
      if (response.success) {
        setSuccess(response.message || 'Registration successful!');
        
        // Check if token is returned (auto-login)
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          
          // Auto-redirect to dashboard
          setTimeout(() => {
            navigate('/');
          }, 1500);
        } else {
          // Redirect to login page
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        }
        
        // Clear form
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          terms: false,
        });
      } else {
        setApiError(response.message || 'Registration failed');
      }
      
    } catch (error) {
      console.error('Registration error details:', error);
      
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.includes('already exists')) {
        errorMessage = 'An account with this email already exists.';
      } else if (error.includes('Invalid') || error.includes('invalid')) {
        errorMessage = 'Invalid input. Please check your information.';
      } else if (error.includes('Network') || error.includes('timeout')) {
        errorMessage = 'Cannot connect to server. Please check: \n1. Backend is running on port 5000\n2. Your internet connection';
      } else if (error.includes('500') || error.includes('Server error')) {
        errorMessage = 'Server error. Please try again later.';
      }
      
      setApiError(errorMessage);
      
      // Clear passwords for security
      setFormData(prev => ({
        ...prev,
        password: '',
        confirmPassword: ''
      }));
      
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
    if (apiError) setApiError('');
    if (success) setSuccess('');
  };

  // Test backend connection
  const testBackendConnection = async () => {
    try {
      const response = await authAPI.test();
      alert(`✅ Backend connected!\nMessage: ${response.message || 'Server is running'}`);
    } catch (error) {
      alert(`❌ Backend connection failed!\n\nPlease check:\n1. Node.js server is running on port 5000\n2. Check terminal for backend errors\n3. Try: cd backend && npm start\n\nError: ${error}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 text-center bg-gradient-to-r from-purple-600 to-blue-600">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
              <User className="h-8 w-8 text-purple-600" />
            </div>
            <h1 className="text-2xl font-bold text-white">Create Account</h1>
            <p className="text-purple-100 mt-2">Join our community today</p>
          </div>

          <div className="p-8">
            {/* Backend Test Button */}
            <button
              onClick={testBackendConnection}
              className="w-full mb-4 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition-colors"
            >
              Test Backend Connection
            </button>

            {/* Error Message */}
            {apiError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{apiError}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700">{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Input */}
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  disabled={isLoading}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              {/* Email Input */}
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  disabled={isLoading}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              {/* Password Input */}
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password (min 6 characters)"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-500"
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="terms"
                  checked={formData.terms}
                  onChange={handleChange}
                  className="h-4 w-4 text-purple-600"
                  disabled={isLoading}
                />
                <label className="ml-2 text-sm text-gray-700">
                  I agree to the terms and conditions
                </label>
              </div>
              {errors.terms && <p className="text-red-500 text-sm">{errors.terms}</p>}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-purple-600 hover:text-purple-500 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;