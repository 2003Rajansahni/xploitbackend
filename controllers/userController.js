// controllers/userController.js

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Session = require('../models/Session');
const Attempt = require('../models/Attempt');

// Register a new user
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  // Basic validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please enter all required fields' });
  }

  if (role && !['student', 'instructor'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role specified' });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'student',
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter all required fields' });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT payload
    const payload = {
      userId: user._id,
      role: user.role,
    };

    // Sign token
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'Rajan', { expiresIn: '1h' });

    // If the user is a student, log their session with the instructor's ID
    if (user.role === 'student') {
      const instructorId = user.instructorId; // Assuming the student has an instructorId field
      if (!instructorId) {
        return res.status(400).json({ message: 'Instructor ID is missing for the student.' });
        
      }

      const instructor = await User.findById(instructorId);
      console.log('Instructor ID:', req.user.userId);

      if (instructor) {
        // Create a new session for the student with reference to their instructor
        await Session.create({ student: user._id, instructor: instructor._id });
        console.log('Session created:', { student: user._id, instructor: instructor._id });
      } else {
        console.warn('Instructor not found for student:', user._id);
      }
    }

    res.status(200).json({ token });

  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error during login' });
  }
};
// logout
exports.logout = async (req, res) => {
  const userId = req.user.userId;

  try {
    // Find the user by ID and delete
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Optional: Delete associated data (e.g., attempts, sessions)
    await Attempt.deleteMany({ student: userId });
    await Session.deleteMany({ student: userId });

    res.status(200).json({ message: 'User and associated data deleted successfully' });
  } catch (error) {
    console.error('Logout error:', error.message);
    res.status(500).json({ message: 'Server error during logout' });
  }
};


// Function to get user role based on JWT token
// Function to get user role based on JWT token
exports.getUserRole = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // Extract token from Authorization header
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'Rajan'); // Decode the token

    if (decoded.exp < Date.now() / 1000) {
      return res.status(401).json({ message: 'Token expired' }); // Handle token expiration
    }

    const user = await User.findById(decoded.userId); // Find the user by ID
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ role: user.role }); // Return the user's role
  } catch (error) {
    console.error('Error fetching user role:', error.message);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

