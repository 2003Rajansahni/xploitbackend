
// controllers/instructorController.js

const Session = require('../models/Session');

exports.getLoggedInStudents = async (req, res) => {
  try {
    // Log for debugging
    console.log('Fetching students for instructor ID:', req.user._id); 

    // Find logged-in students for the given instructor
    const loggedInStudents = await Session.find({ instructor: req.user._id })
      .populate('student', 'name email');
    
    if (!loggedInStudents.length) {
      return res.status(404).json({ message: 'No students are currently logged in.' });
    }

    res.status(200).json({ loggedInStudents });
  } catch (error) {
    console.error('Error fetching logged-in students:', error.message);
    res.status(500).json({ message: 'Error fetching logged-in students' });
  }
};




















// // controllers/instructorController.js
// const Session = require('../models/Session');

// exports.getLoggedInStudents = async (req, res) => {
//     console.log('Fetching students for instructor ID:', req.user._id);
//     try {
//       const instructorId = req.user.userId;
//       console.log('Fetching students for instructor ID:', instructorId);
  
//       const loggedInStudents = await Session.find({ instructor: instructorId })
//         .populate('student', 'name email');
      
//       console.log('Found logged-in students:', loggedInStudents);
  
//       if (!loggedInStudents.length) {
//         return res.status(404).json({ message: 'No students are currently logged in.' });
//       }
  
//       res.status(200).json({ loggedInStudents });
//     } catch (error) {
//       console.error('Error fetching logged-in students:', error.message);
//       res.status(500).json({ message: 'Error fetching logged-in students' });
//     }
//   };
  
  
  
  
