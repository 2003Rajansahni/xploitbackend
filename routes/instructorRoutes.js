// routes/instructorRoutes.js

const express = require('express');
const { createQuestion, updateQuestion, deleteQuestion } = require('../controllers/questionController');
const { authenticate, authorizeInstructor } = require('../middleware/auth');
const { getLoggedInStudents } = require('../controllers/instructorController');

const router = express.Router();

// All routes here require authentication and instructor role

// @route   POST /api/instructor/questions
// @desc    Create a new question
// @access  Instructor
router.post('/questions', authenticate, authorizeInstructor, createQuestion);

// @route   PUT /api/instructor/questions/:id
// @desc    Update an existing question
// @access  Instructor
router.put('/questions/:id', authenticate, authorizeInstructor, updateQuestion);

// @route   DELETE /api/instructor/questions/:id
// @desc    Delete a question
// @access  Instructor
router.delete('/questions/:id', authenticate, authorizeInstructor, deleteQuestion);

// @route   GET /api/instructor/logged-in-students
// @desc    Get students currently logged in for the instructor
// @access  Instructor
router.get('/logged-in-students', authenticate, authorizeInstructor, getLoggedInStudents);

module.exports = router;














// const express = require('express');
// const { createQuestion, updateQuestion, deleteQuestion } = require('../controllers/questionController');
// const { authenticate, authorizeInstructor } = require('../middleware/auth');
// const { getLoggedInStudents } = require('../controllers/instructorController');

// const router = express.Router();

// // All routes here require authentication and instructor role

// // @route   POST /api/instructor/questions
// // @desc    Create a new question
// // @access  Instructor
// router.post('/questions', authenticate, authorizeInstructor, createQuestion);

// // @route   PUT /api/instructor/questions/:id
// // @desc    Update an existing question
// // @access  Instructor
// router.put('/questions/:id', authenticate, authorizeInstructor, updateQuestion);

// // @route   DELETE /api/instructor/questions/:id
// // @desc    Delete a question
// // @access  Instructor
// router.delete('/questions/:id', authenticate, authorizeInstructor, deleteQuestion);

// // @route   GET /api/instructor/logged-in-students
// // @desc    Get a list of logged-in students
// // @access  Instructor
// router.get('/logged-in-students', authenticate, authorizeInstructor, (req, res, next) => {
//     console.log('Route hit for logged-in students');
//     next();
// }, getLoggedInStudents);

// module.exports = router;
