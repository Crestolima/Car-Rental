import React, { useState, useEffect } from 'react';
import { BarChart, LineChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, Calendar, DollarSign } from 'lucide-react';
import { Car as Caricon } from "lucide-react";
import axios from 'axios';

const StatCard = ({ title, value, icon: Icon, change }) => (
  <div className="bg-white rounded-lg p-6 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-semibold mt-1">{value}</p>
      </div>
      <div className="bg-blue-100 p-3 rounded-lg">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
    </div>
    <div className="flex items-center">
      <span className={`text-sm ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
        {change >= 0 ? '+' : ''}{change}%
      </span>
      <span className="text-sm text-gray-500 ml-2">from last month</span>
    </div>
  </div>
);

const AdashContent = () => {
  const [stats, setStats] = useState({
    users: 0,
    cars: 0,
    earnings: 0,
    bookings: 0,
  });

  const [bookingData, setBookingData] = useState([]);
  const [earningsData, setEarningsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
        try {
          setLoading(true);
          
          const response = await axios.get('/api/dashboard/stats');
          const dashboardData = response.data;
      
          setStats({
            users: dashboardData.stats.users.total,
            cars: dashboardData.stats.cars.total,
            earnings: dashboardData.stats.earnings.total,
            bookings: dashboardData.stats.bookings.total
          });
      
          setBookingData(dashboardData.charts.bookings);
          setEarningsData(dashboardData.charts.earnings);
      
        } catch (err) {
          console.error('Error fetching dashboard data:', err);
          setError(
            `Failed to load dashboard data: ${err.response?.data?.error || err.message}`
          );
        } finally {
          setLoading(false);
        }
      };

    fetchDashboardData();
  }, []);

  const processMonthlyData = (bookings, type) => {
    if (!Array.isArray(bookings)) {
      console.error('Invalid bookings data:', bookings);
      return [];
    }

    const months = {};
    
    bookings.forEach(booking => {
      if (!booking || !booking.createdAt) return;

      const date = new Date(booking.createdAt);
      if (isNaN(date.getTime())) return;

      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!months[monthKey]) {
        months[monthKey] = {
          month: new Date(date.getFullYear(), date.getMonth(), 1).toLocaleString('default', { month: 'short' }),
          bookings: 0,
          earnings: 0
        };
      }
      
      months[monthKey].bookings += 1;
      if (booking.status === 'confirmed' && typeof booking.totalPrice === 'number') {
        months[monthKey].earnings += booking.totalPrice;
      }
    });

    return Object.values(months).slice(-6).map(data => ({
      month: data.month,
      [type]: type === 'bookings' ? data.bookings : data.earnings
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg text-gray-600">Loading dashboard data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 text-sm text-blue-600 hover:text-blue-800"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.users}
          icon={Users}
          change={12.5}
        />
        <StatCard
          title="Available Cars"
          value={stats.cars}
          icon={Caricon}
          change={8.2}
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats.earnings.toLocaleString()}`}
          icon={DollarSign}
          change={15.3}
        />
        <StatCard
          title="Total Bookings"
          value={stats.bookings}
          icon={Calendar}
          change={-4.8}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bookings Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Monthly Bookings</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bookingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bookings" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Monthly Revenue</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={earningsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                <Line 
                  type="monotone" 
                  dataKey="earnings" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdashContent;