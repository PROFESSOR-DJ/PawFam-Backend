const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/vendor-profile', require('./routes/vendorProfile'));
app.use('/api/pets', require('./routes/pets'));
app.use('/api/daycare', require('./routes/daycare'));
app.use('/api/products', require('./routes/products'));
app.use('/api/adoption', require('./routes/adoption'));

// Vendor-specific routes:
app.use('/api/vendor/daycare', require('./routes/vendorDaycare'));
app.use('/api/vendor/adoption', require('./routes/vendorAdoption'));
app.use('/api/vendor/accessories', require('./routes/vendorAccessories'));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ message: 'PetFam API is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler - FIXED: Removed the '*' parameter
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});