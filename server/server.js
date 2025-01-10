const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const carRoutes = require('./routes/car');
//const bookingRoutes = require('./routes/booking');
//const paymentRoutes = require('./routes/payment');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
//app.use('/api/bookings', bookingRoutes);
//app.use('/api/payments', paymentRoutes);

// Database Connection
mongoose.connect(process.env.MONGO_URI) 
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('Database connection failed:', err);
    process.exit(1); // Exit the process if connection fails
  });

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 