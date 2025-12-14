import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Phone } from 'lucide-react';
import { authAPI } from '/src/services/authAPI.js';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    terms: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();

  /* -------------------- LOGIC (UNCHANGED) -------------------- */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    else if (formData.name.length < 2) newErrors.name = 'Name must be at least 2 characters';

    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else {
      const cleaned = formData.phone.replace(/\D/g, '');
      if (cleaned.length < 10 || cleaned.length > 15) {
        newErrors.phone = 'Phone number must be between 10 and 15 digits';
      } else if (!/^(0[79]|0|\+251[79]|\+251)/.test(formData.phone)) {
        newErrors.phone = 'Enter a valid Ethiopian phone number';
      }
    }

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    if (!formData.terms) newErrors.terms = 'You must accept the terms';

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
      const response = await authAPI.register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      if (response.success) {
        setSuccess(response.message || 'Registration successful!');
        setTimeout(() => navigate(response.token ? '/dashboard' : '/login'), 1500);
      } else {
        setApiError(response.message || 'Registration failed');
      }
    } catch (err) {
      setApiError('Registration failed. Please try again.');
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
    setErrors({ ...errors, [name]: '' });
  };

  /* -------------------- UI -------------------- */
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md">
        <div className="border border-gray-200 rounded-xl shadow-sm">
          
          {/* Header */}
          <div className="px-8 pt-8 pb-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Create your account
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Start using the platform in minutes
            </p>
          </div>

          {/* Body */}
          <div className="px-8 pb-8">
            {apiError && (
              <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {apiError}
              </div>
            )}

            {success && (
              <div className="mb-4 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Input styles */}
              {[
                { name: 'name', placeholder: 'Full name' },
                { name: 'email', placeholder: 'Email address', type: 'email' },
              ].map(({ name, placeholder, type = 'text' }) => (
                <div key={name}>
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className={`w-full rounded-lg border px-4 py-2.5 text-sm transition
                      focus:outline-none focus:ring-2 focus:ring-blue-500
                      ${errors[name] ? 'border-red-400' : 'border-gray-300 hover:border-gray-400'}
                    `}
                  />
                  {errors[name] && <p className="mt-1 text-xs text-red-500">{errors[name]}</p>}
                </div>
              ))}

              {/* Phone */}
              <div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone number"
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm transition
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                    ${errors.phone ? 'border-red-400' : 'border-gray-300 hover:border-gray-400'}
                  `}
                />
                {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
              </div>

              {/* Password */}
              {[
                { name: 'password', label: 'Password', show: showPassword, toggle: setShowPassword },
                { name: 'confirmPassword', label: 'Confirm password', show: showConfirmPassword, toggle: setShowConfirmPassword },
              ].map(({ name, label, show, toggle }) => (
                <div key={name} className="relative">
                  <input
                    type={show ? 'text' : 'password'}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    placeholder={label}
                    className={`w-full rounded-lg border px-4 py-2.5 pr-10 text-sm transition
                      focus:outline-none focus:ring-2 focus:ring-blue-500
                      ${errors[name] ? 'border-red-400' : 'border-gray-300 hover:border-gray-400'}
                    `}
                  />
                  <button
                    type="button"
                    onClick={() => toggle(!show)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  {errors[name] && <p className="mt-1 text-xs text-red-500">{errors[name]}</p>}
                </div>
              ))}

              {/* Terms */}
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  name="terms"
                  checked={formData.terms}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                I agree to the terms and conditions
              </label>
              {errors.terms && <p className="text-xs text-red-500">{errors.terms}</p>}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white
                  transition hover:bg-blue-700 active:scale-[0.99]
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating account…' : 'Create account'}
              </button>
            </form>

            {/* Footer */}
            <p className="mt-6 text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
