import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Mail, Lock, User, Phone, CreditCard, Loader2 } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    drivingLicense: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      localStorage.setItem('userToken', data.token);
      localStorage.setItem('userData', JSON.stringify(data));

      toast.success('Registration successful! Redirecting to home...');
      navigate('/');
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Create Your Account</h1>
            <p className="text-sm text-gray-600 mt-2">
              Join us and start renting your dream car today
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">First Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-4 flex items-center">
                    <User className="h-5 w-5 text-gray-400" />
                  </span>
                  <input
                    type="text"
                    name="firstName"
                    required
                    placeholder="Enter first name"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-gray-900"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">Last Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-4 flex items-center">
                    <User className="h-5 w-5 text-gray-400" />
                  </span>
                  <input
                    type="text"
                    name="lastName"
                    required
                    placeholder="Enter last name"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-gray-900"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-700 mb-2">Email address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-4 flex items-center">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </span>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-gray-900"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-4 flex items-center">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </span>
                  <input
                    type="password"
                    name="password"
                    required
                    placeholder="Create a password"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-gray-900"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">Phone Number</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-4 flex items-center">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </span>
                  <input
                    type="tel"
                    name="phoneNumber"
                    required
                    placeholder="Enter phone number"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-gray-900"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Driving License */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Driving License Number
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-4 flex items-center">
                    <CreditCard className="h-5 w-5 text-gray-400" />
                  </span>
                  <input
                    type="text"
                    name="drivingLicense"
                    required
                    placeholder="Enter license number"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-gray-900"
                    value={formData.drivingLicense}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                required
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                I agree to the{' '}
                <button type="button" className="text-blue-600 hover:text-blue-500">
                  Terms of Service
                </button>{' '}
                and{' '}
                <button type="button" className="text-blue-600 hover:text-blue-500">
                  Privacy Policy
                </button>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  <span>Creating account...</span>
                </div>
              ) : (
                <span>Create account</span>
              )}
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Sign in
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;