const Question = require('../models/Question');

exports.createQuestion = async (req, res) => {
  const { questionText, options } = req.body;
  const userId = req.user.userId;

  // Validation
  if (!questionText || !options || !Array.isArray(options) || options.length < 2) {
    return res.status(400).json({ message: 'Invalid question data' });
  }

  const correctOptions = options.filter(option => option.isCorrect);
  if (correctOptions.length !== 1) { // Assuming one correct answer per question
    return res.status(400).json({ message: 'Each question must have exactly one correct option' });
  }

  try {
    // Calculate the next question number
    const lastQuestion = await Question.findOne().sort({ questionNumber: -1 });
    const nextQuestionNumber = lastQuestion ? lastQuestion.questionNumber + 1 : 1;

    const newQuestion = new Question({
      questionText,
      options,
      questionNumber: nextQuestionNumber,
      createdBy: userId,
    });

    await newQuestion.save();

    res.status(201).json({ message: 'Question created successfully', question: newQuestion });

  } catch (error) {
    console.error('Create question error:', error.message);
    res.status(500).json({ message: 'Server error while creating question' });
  }
};

exports.updateQuestion = async (req, res) => {
  const { id } = req.params;
  const { questionText, options } = req.body;
  const userId = req.user.userId;

  try {
    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Check if the user is the creator
    if (question.createdBy.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized to update this question' });
    }

    // Update fields if provided
    if (questionText) question.questionText = questionText;
    if (options) {
      if (!Array.isArray(options) || options.length < 2) {
        return res.status(400).json({ message: 'Invalid options data' });
      }

      const correctOptions = options.filter(option => option.isCorrect);
      if (correctOptions.length !== 1) {
        return res.status(400).json({ message: 'Each question must have exactly one correct option' });
      }

      question.options = options;
    }

    await question.save();

    res.status(200).json({ message: 'Question updated successfully', question });

  } catch (error) {
    console.error('Update question error:', error.message);
    res.status(500).json({ message: 'Server error while updating question' });
  }
};

exports.deleteQuestion = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Check if the user is the creator
    if (question.createdBy.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized to delete this question' });
    }

    // Directly delete the question using findByIdAndDelete
    await Question.findByIdAndDelete(id);  // Alternative

    res.status(200).json({ message: 'Question deleted successfully' });

  } catch (error) {
    console.error('Delete question error:', error.message);
    res.status(500).json({ message: 'Server error while deleting question' });
  }
};

exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find().sort({ questionNumber: 1 }).populate('createdBy', 'name email');
    res.status(200).json({ questions });
  } catch (error) {
    console.error('Get questions error:', error.message);
    res.status(500).json({ message: 'Server error while fetching questions' });
  }
};
