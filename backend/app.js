const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser
app.use(express.json());
app.use(cors());

// Routes
app.use('/api', userRoutes);

// Routing errors
app.all('*', (req, res, next) => {
  next(new AppError(`Could not find ${req.originalUrl} on this server`, 404));
});

// Export App
module.exports = app;
