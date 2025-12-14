import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { authAPI } from "/src/services/authAPI";
import { useAuth } from "/src/context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  /* ---------------- LOGIC (UNCHANGED) ---------------- */
  const handleChange = (e) => {
    setApiError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setIsLoading(true);

    try {
      const response = await authAPI.login(formData);

      let token, user;

      if (response?.token) {
        token = response.token;
        user = response.user;
      } else if (response?.data?.token) {
        token = response.data.token;
        user = response.data.user;
      } else if (response?.access_token) {
        token = response.access_token;
        user = response.user;
      }

      if (!token) throw new Error("Authentication failed");

      login({ ...user, token });
      localStorage.setItem("token_timestamp", Date.now().toString());

      navigate("/dashboard");
    } catch (err) {
      setApiError(
        err?.message?.toLowerCase().includes("invalid")
          ? "Invalid email or password"
          : "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
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
              Sign in to your account
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Welcome back
            </p>
          </div>

          {/* Body */}
          <div className="px-8 pb-8">
            {apiError && (
              <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    required
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-gray-300 pl-10 px-4 py-2.5 text-sm
                      transition hover:border-gray-400
                      focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-gray-300 pl-10 pr-10 px-4 py-2.5 text-sm
                      transition hover:border-gray-400
                      focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white
                  transition hover:bg-blue-700 active:scale-[0.99]
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Signing in…" : "Sign in"}
              </button>
            </form>

            {/* Footer */}
            <p className="mt-6 text-center text-sm text-gray-500">
              Don’t have an account?{" "}
              <Link to="/register" className="font-medium text-blue-600 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
