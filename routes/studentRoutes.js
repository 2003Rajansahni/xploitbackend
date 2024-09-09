const express = require('express');
const { getQuestions } = require('../controllers/questionController');
const { submitAttempt, getResults } = require('../controllers/attemptController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// All routes here require authentication

// @route   GET /api/student/questions
// @desc    Get all questions
// @access  Student
router.get('/questions', authenticate, getQuestions);

// @route   POST /api/student/attempts
// @desc    Submit quiz attempt
// @access  Student
router.post('/attempts', authenticate, submitAttempt);

// @route   GET /api/student/attempts
// @desc    Check if the student has already attempted the quiz
// @access  Student
router.get('/attempts', authenticate, getResults); // This route can check if the student already submitted the quiz

// @route   GET /api/student/results
// @desc    Get all quiz attempts and results
// @access  Student
router.get('/results', authenticate, getResults); // This route will return quiz results

module.exports = router;
