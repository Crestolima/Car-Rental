const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // Import your database connection function
const { errorHandler } = require('./middleware/errorHandler');
const path = require('path');
require('dotenv').config(); // Load environment variables  // <--- Important

// Import routes
const authRoutes = require('./routes/auth');
const carRoutes = require('./routes/cars');
const bookingRoutes = require('./routes/bookings');
const reviewRoutes = require('./routes/reviews');
const walletRoutes = require('./routes/wallet');
const paymentRoutes = require('./routes/paymentRoutes'); // Import payment routes
const transactionRoutes = require('./routes/transactionRoutes'); // Import transaction routes


// Initialize express
const app = express();
const PORT = process.env.PORT || 5000; // Use environment variable or default

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/payments', paymentRoutes); // Use imported routes
app.use('/api/transactions', transactionRoutes); // Use imported routes

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});