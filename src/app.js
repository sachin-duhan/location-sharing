const express = require('express');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const locationRoutes = require('./routes/locationRoutes');

const app = express();

// Middleware to parse JSON
app.use(express.json());

app.use(express.static(path.join(__dirname, '../web')));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Service is running' });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../web/index.html'));
});

// Define routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/location', locationRoutes);

// Handle 404 for missing routes
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} does not exist`,
  });
});

module.exports = app;
