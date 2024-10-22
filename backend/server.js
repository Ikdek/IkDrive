// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fileRoutes = require('./routes/fileRoutes');
const path = require('path');

const app = express();

// Enable CORS
app.use(cors());

// Middleware for parsing JSON bodies
app.use(express.json());

// Middleware for serving static files
app.use('/uploads', express.static(path.join(__dirname, process.env.UPLOAD_DIR)));

// Routes for files
app.use('/api/files', fileRoutes);

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});