const path = require('path');
const express = require('express');
const cors = require('cors');

const app = express();

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Body parser
app.use(express.json());
app.use(cors());

// Export App
module.exports = app;
