import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./components/common/Footer";
import { AuthProvider } from "./context/AuthContext";
import Admin from "./pages/Admin";
import CarDetails from "./pages/CarDetails";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Search from "./pages/Search";

import AdminDashboard from "./components/dash/AdminDashboard";
import UserDashboard from "./components/dash/UserDashboard";
import Wallet from "./components/wallet/Wallet";
import CarBooking from "./pages/BookingPage";
import ShowAllCars from "./pages/ShowAllCars";
import Users from "./pages/Users";
import BookingPage from "./pages/BookingPage";

const App = () => {
  const location = useLocation();
  const showFooter = ["/", "/login", "/register"].includes(location.pathname);

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/car-details" element={<CarDetails />} />
            <Route path="/users" element={<Users />} />
            <Route path="/show-cars" element={<ShowAllCars />} />
           
            <Route path="/booking/:carId/:userId" element={<BookingPage />} />
            
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
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
