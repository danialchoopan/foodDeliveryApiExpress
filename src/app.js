const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const routes = require('./routes');
const { errorHandler } = require('./middlewares/errorHandler');

const app = express();

app.use(helmet({
  contentSecurityPolicy: false, // For easier CDN use in this demo environment
}));
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Static files
app.use(express.static(path.join(__dirname, '../public')));

// API routes
app.use('/api', routes);

// Serve frontend index for all non-API routes (SPA support)
app.get('*', (req, res, next) => {
  if (req.url.startsWith('/api')) return next();
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Errors
app.use(errorHandler);

module.exports = app;
