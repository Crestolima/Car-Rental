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

// Define menuItems array
const menuItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'appointments', label: 'Appointments', icon: Calendar },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'settings', label: 'Settings', icon: Settings },
];

// Custom Modal Component
const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Modal */}
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

const UserDashboard = () => {
  const [activeItem, setActiveItem] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
    // You might want to redirect to login page here
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-indigo-600 to-violet-600 flex items-center justify-between px-4 md:px-8 z-30">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="mr-4 text-white hover:bg-white/10 p-2 rounded-lg lg:hidden"
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
            <button className="p-2 text-white/70 hover:text-white">
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* Notification Button */}
          <button className="relative p-2 text-white hover:bg-white/10 rounded-lg">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="flex items-center space-x-2 text-white">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <span className="hidden sm:inline">John Doe</span>
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

      {/* Logout Modal */}
      <LogoutModal 
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />

      {/* Dashboard layout */}
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
            onClick={toggleSidebar}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="p-6">
            {/* Welcome Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, John!</h2>
              <p className="text-gray-600">
                Here's what's happening with your account today.
              </p>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center space-x-3 mb-2">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-semibold text-gray-900">Upcoming Appointments</h3>
                </div>
                <p className="text-2xl font-bold text-gray-900">3</p>
                <p className="text-sm text-gray-500">Next: Tomorrow at 2:00 PM</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center space-x-3 mb-2">
                  <MessageSquare className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-semibold text-gray-900">Unread Messages</h3>
                </div>
                <p className="text-2xl font-bold text-gray-900">5</p>
                <p className="text-sm text-gray-500">2 new since yesterday</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center space-x-3 mb-2">
                  <CreditCard className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-semibold text-gray-900">Next Payment</h3>
                </div>
                <p className="text-2xl font-bold text-gray-900">$149.99</p>
                <p className="text-sm text-gray-500">Due in 5 days</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Document Updated</p>
                      <p className="text-sm text-gray-500">Insurance form was updated</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">2 hours ago</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Appointment Scheduled</p>
                      <p className="text-sm text-gray-500">New appointment for next week</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">Yesterday</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;