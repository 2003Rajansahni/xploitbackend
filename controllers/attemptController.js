const Attempt = require('../models/Attempt');
const Question = require('../models/Question');

exports.submitAttempt = async (req, res) => {
   const { answers, startTime } = req.body;
  const userId = req.user.userId;
   const currentTime = new Date();
  
  // Calculate time difference in minutes
  const timeDiff = (currentTime - new Date(startTime)) / (1000 * 60);
  if (timeDiff > 60) {
    return res.status(400).json({ message: 'Time is up. You cannot submit the quiz.' });
  }

  // Check if answers are valid
  if (!answers || !Array.isArray(answers)) {
    return res.status(400).json({ message: 'Invalid answers format' });
  }

  try {
    // Check if the student has already attempted the quiz
    const existingAttempt = await Attempt.findOne({ student: userId });
    if (existingAttempt) {
      return res.status(400).json({ message: 'You have already attempted the quiz' });
    }

    let score = 0;
    const detailedAnswers = [];

    // Loop through the answers and calculate the score
    for (const ans of answers) {
      const question = await Question.findById(ans.question).select('options');
      if (!question) {
        return res.status(400).json({ message: `Question not found: ${ans.question}` });
      }

      const selectedOption = question.options.id(ans.selectedOption);
      if (!selectedOption) {
        return res.status(400).json({ message: `Invalid option selected for question: ${ans.question}` });
      }

      // Check if the selected option is correct
      if (selectedOption.isCorrect) {
        score += 1;
      }

      detailedAnswers.push({
        question: ans.question,
        selectedOption: ans.selectedOption,
      });
    }

    // Create a new attempt record in the database
    const newAttempt = new Attempt({
      student: userId,
      answers: detailedAnswers,
      score,
    });

    await newAttempt.save();

    res.status(201).json({ message: 'Attempt submitted successfully', score });

  } catch (error) {
    console.error('Submit attempt error:', error.message);
    res.status(500).json({ message: 'Server error while submitting attempt' });
  }
};

// Get all quiz attempts for the logged-in student
exports.getResults = async (req, res) => {
  const userId = req.user.userId;

  try {
    const attempts = await Attempt.find({ student: userId })
      .populate({
        path: 'answers.question',
        select: 'questionText',
      })
      .populate({
        path: 'answers.selectedOption',
        select: 'optionText isCorrect',
      })
      .sort({ createdAt: -1 }); // Sort by latest attempts first

    res.status(200).json({ attempts });
  } catch (error) {
    console.error('Get results error:', error.message);
    res.status(500).json({ message: 'Server error while fetching results' });
  }
};
