import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  
  Car,
  Calendar,
  DollarSign,
  Settings,
  User,
  LogOut,
  Search,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import CarDetails from '../../pages/CarDetails';
import Users from '../../pages/Users';
import { Users as UsersIcon } from 'lucide-react';


const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart },
  { id: 'users', label: 'Users', icon: UsersIcon },
  { id: 'cars', label: 'Cars', icon: Car },
  { id: 'bookings', label: 'Bookings', icon: Calendar },
  { id: 'payments', label: 'Payments', icon: DollarSign },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-lg p-6 w-full max-w-sm mx-4 shadow-xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Confirm Logout
        </h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to logout? You will need to login again to access your account.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

const DashboardContent = () => (
  <>
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Dashboard Overview</h2>
      <p className="text-gray-600">
        Welcome to the dashboard. Select an item from the sidebar to view different sections.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Total Users</span>
            <span className="font-semibold text-gray-900">1,234</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Active Sessions</span>
            <span className="font-semibold text-gray-900">56</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Today's Revenue</span>
            <span className="font-semibold text-gray-900">$1,234</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">New user registration</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">Payment received</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-600">System update completed</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Server Status</span>
            <span className="text-green-500 font-medium">Online</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Last Backup</span>
            <span className="text-gray-900">2 hours ago</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">System Load</span>
            <span className="text-gray-900">42%</span>
          </div>
        </div>
      </div>
    </div>
  </>
);

const AdminDashboard = () => {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setShowLogoutModal(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderContent = () => {
    switch (activeItem) {
      case 'cars':
        return <CarDetails />;
      case 'users':
          return <Users />;  
      case 'dashboard':
        return <DashboardContent />;
      default:
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {activeItem.charAt(0).toUpperCase() + activeItem.slice(1)}
            </h2>
            <p className="text-gray-600">
              This section is under development. Please check back later.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <header className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-between px-4 md:px-8 z-30">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="mr-4 text-white hover:bg-white/10 p-2 rounded-lg lg:hidden"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center bg-white/10 rounded-lg">
            <input
              type="text"
              placeholder="Search..."
              className="w-48 lg:w-64 px-4 py-1.5 bg-transparent text-white placeholder-white/70 outline-none"
            />
            <button className="p-2 text-white/70 hover:text-white">
              <Search className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center space-x-2 text-white">
            <User className="w-5 h-5" />
            <span className="hidden sm:inline">Admin</span>
          </div>
          <button 
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center space-x-2 text-white hover:opacity-80"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <LogoutModal 
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />

      <div className="flex w-full pt-16">
        <aside 
          className={`fixed lg:static top-16 bottom-0 w-64 bg-white border-r border-gray-100 transform transition-transform duration-300 ease-in-out z-20 
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
        >
          <nav className="h-full overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveItem(item.id);
                  if (window.innerWidth < 1024) setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center px-6 py-3 transition-all duration-200 ${
                  activeItem === item.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className={`w-5 h-5 ${
                    activeItem === item.id ? 'text-blue-600' : 'text-gray-600'
                  }`} />
                  <span className="font-medium">{item.label}</span>
                </div>
              </button>
            ))}
          </nav>
        </aside>

        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 lg:hidden z-10"
            onClick={toggleSidebar}
          />
        )}

        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;