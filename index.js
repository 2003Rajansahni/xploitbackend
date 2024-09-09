const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./db');
const authRoutes = require('./routes/authRoutes'); // Authentication routes
const instructorRoutes = require('./routes/instructorRoutes'); // Instructor routes
const studentRoutes = require('./routes/studentRoutes'); // Student routes
const cors = require('cors');
const morgan = require('morgan');

dotenv.config();

// Initialize Express app
const app = express();

// Use morgan middleware for logging
app.use(morgan('dev'));

// Use CORS middleware
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend's URL
  optionsSuccessStatus: 200,
}));

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes); // Authentication-related routes
app.use('/api/instructor', instructorRoutes); // Instructor-related routes
app.use('/api/student', studentRoutes); // Student-related routes

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Quiz Application API');
});

// Handle 404 - Not Found
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
