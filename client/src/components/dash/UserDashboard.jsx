import React, { useState } from 'react';
import {
  Home,
  FileText,
  Calendar,
  CreditCard,
  MessageSquare,
  Bell,
  Settings,
  User,
  LogOut,
  Search,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ShowAllCars from '../../pages/ShowAllCars';
import Wallet from '../wallet/Wallet';

// Menu Items Configuration
const menuItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'cars', label: 'Cars', icon: FileText },
  { id: 'appointments', label: 'Appointments', icon: Calendar },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'wallet', label: 'Wallet', icon: Settings },
];

// Logout Modal Component
const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative bg-white rounded-lg p-6 w-full max-w-sm mx-4 shadow-xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Sign Out
        </h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to sign out? Your session will end and you'll need to sign in again.
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
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

// Stats Card Component
const StatsCard = ({ icon: Icon, title, value, subtitle }) => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex items-center space-x-3 mb-2">
      <Icon className="w-5 h-5 text-indigo-600" />
      <h3 className="font-semibold text-gray-900">{title}</h3>
    </div>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
    <p className="text-sm text-gray-500">{subtitle}</p>
  </div>
);

// Activity Item Component
const ActivityItem = ({ icon: Icon, title, description, time }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
        <Icon className="w-5 h-5 text-indigo-600" />
      </div>
      <div>
        <p className="font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
    <span className="text-sm text-gray-500">{time}</span>
  </div>
);

// Home Content Component
const HomeContent = ({ firstName }) => (
  <>
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {firstName}!</h2>
      <p className="text-gray-600">
        Here's what's happening with your account today.
      </p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      <StatsCard 
        icon={Calendar}
        title="Upcoming Appointments"
        value="3"
        subtitle="Next: Tomorrow at 2:00 PM"
      />
      
      <StatsCard 
        icon={MessageSquare}
        title="Unread Messages"
        value="5"
        subtitle="2 new since yesterday"
      />
      
      <StatsCard 
        icon={CreditCard}
        title="Next Payment"
        value="$149.99"
        subtitle="Due in 5 days"
      />
    </div>

    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        <ActivityItem 
          icon={FileText}
          title="Document Updated"
          description="Insurance form was updated"
          time="2 hours ago"
        />
        
        <ActivityItem 
          icon={Calendar}
          title="Appointment Scheduled"
          description="New appointment for next week"
          time="Yesterday"
        />
      </div>
    </div>
  </>
);

// Main Dashboard Component
const UserDashboard = () => {
  const [activeItem, setActiveItem] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Get full name from user object
  const fullName = user ? `${user.firstName} ${user.lastName}` : 'Guest';
  const firstName = user?.firstName || 'Guest';

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

  const renderContent = () => {
    switch (activeItem) {
      case 'home':
        return <HomeContent firstName={firstName} />;
      case 'cars':
        return <ShowAllCars />;
      case 'wallet':
        return <Wallet />;
      default:
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {activeItem.charAt(0).toUpperCase() + activeItem.slice(1)}
            </h2>
            <p className="text-gray-600">
              This section is currently under development. Please check back later for updates.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-indigo-600 to-violet-600 flex items-center justify-between px-4 md:px-8 z-30">
        <div className="flex items-center">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="mr-4 text-white hover:bg-white/10 p-2 rounded-lg lg:hidden"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <h1 className="text-xl font-bold text-white">My Dashboard</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center bg-white/10 rounded-lg">
            <input
              type="text"
              placeholder="Search..."
              className="w-48 lg:w-64 px-4 py-1.5 bg-transparent text-white placeholder-white/70 outline-none"
            />
            <button className="p-2 text-white/70 hover:text-white" aria-label="Search">
              <Search className="w-4 h-4" />
            </button>
          </div>

          <button 
            className="relative p-2 text-white hover:bg-white/10 rounded-lg"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="flex items-center space-x-2 text-white">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <span className="hidden sm:inline">{fullName}</span>
          </div>
          
          <button 
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center space-x-2 text-white hover:opacity-80"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      <LogoutModal 
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />

      <div className="flex w-full pt-16">
        {/* Sidebar */}
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
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className={`w-5 h-5 ${
                    activeItem === item.id ? 'text-indigo-600' : 'text-gray-600'
                  }`} />
                  <span className="font-medium">{item.label}</span>
                </div>
              </button>
            ))}
          </nav>
        </aside>

        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 lg:hidden z-10"
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;