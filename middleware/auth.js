
// middleware/auth.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'Rajan');
    req.user = decoded; // Attach decoded token to request object

    // Optionally fetch the user to ensure it exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Attach user object to request if needed
    req.user = user; 
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

exports.authorizeInstructor = (req, res, next) => {
  if (req.user.role !== 'instructor') {
    return res.status(403).json({ message: 'Access denied, instructors only' });
  }
  next();
};






























// // middleware/auth.js

// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// exports.authenticate = (req, res, next) => {
//   const authHeader = req.header('Authorization');

//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ message: 'No token, authorization denied' });
//   }

//   const token = authHeader.split(' ')[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET || 'Rajan');
//     req.user = decoded; // Attach decoded token to request object
//     next();
//   } catch (error) {
//     res.status(401).json({ message: 'Token is not valid' });
//   }
// };


// exports.authorizeInstructor = (req, res, next) => {
//     if (req.user.role !== 'instructor') {
//       return res.status(403).json({ message: 'Access denied, instructors only' });
//     }
//     next();
//   };
  

// middleware/auth.js

// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// exports.authenticate = async (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ message: 'No token, authorization denied' });
//   }

//   const token = authHeader.split(' ')[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET || 'Rajan');
//     console.log('Decoded token:', decoded); 
//     req.user = decoded; // Attach decoded token to request object

//     // Find user by ID and attach to request object
//     const user = await User.findById(decoded.userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     req.user = user; // Attach full user object to request object
//     next();
//   } catch (error) {
//     console.error('Authentication error:', error.message);
//     res.status(401).json({ message: 'Token is not valid' });
//   }
// };

// exports.authorizeInstructor = (req, res, next) => {
//   if (req.user.role !== 'instructor') {
//     return res.status(403).json({ message: 'Access denied, instructors only' });
//   }
//   next();
// };

