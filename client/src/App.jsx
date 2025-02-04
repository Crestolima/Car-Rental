import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Footer from './components/common/Footer';
import { AuthProvider } from './context/AuthContext';
import Admin from './pages/Admin';
import CarDetails from './pages/CarDetails';
import Home from './pages/Home';
import Login from './pages/Login';

import Register from './pages/Register';
import Search from './pages/Search';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BookingPage from './components/bookings/BookingPage';
import PaymentPage from './components/bookings/PaymentPage';
import AdminDashboard from './components/dash/AdminDashboard';
import UserDashboard from './components/dash/UserDashboard';
import Wallet from './components/wallet/Wallet';
import ShowAllCars from './pages/ShowAllCars';
import Users from './pages/Users';


const App = () => {
  const location = useLocation();
  const showFooter = 
    location.pathname === '/' || 
    location.pathname === '/login' || 
    location.pathname === '/register';

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/cars" element={<CarDetails />} />
            <Route path="/users" element={<Users />} />
            <Route path="/show-cars" element={<ShowAllCars />} />
            <Route path="/" element={<ShowAllCars />} />
            <Route path="/booking/:carId" element={<BookingPage />} />
            <Route path="/payment/:carId" element={<PaymentPage />} />
            <Route path="/wallet" element={<Wallet />} />
            

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            
            
            <Route path="/admin" element={<Admin />} />

            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          </Routes>
        </main>
        {showFooter && <Footer />} 
      </div>
      <ToastContainer />
    </AuthProvider>
  );
};

export default App;