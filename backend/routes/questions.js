const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Question = require('../models/Question');
const User = require('../models/User');
const Answer = require('../models/Answer');
const multer = require('multer');
const path = require('path');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// @route   POST api/questions/upload
// @desc    Upload image for question/answer
router.post('/upload', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }
    res.json({ url: `/uploads/${req.file.filename}` });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/questions
// @desc    Get all questions
router.get('/', async (req, res) => {
  try {
    const questions = await Question.find()
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    res.json(questions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/questions
// @desc    Create a question
router.post(
  '/',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('tags', 'Tags are required').isArray({ min: 1 })
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, tags } = req.body;

    try {
      const newQuestion = new Question({
        title,
        description,
        tags,
        author: req.user.id
      });

      const question = await newQuestion.save();
      res.json(question);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/questions/:id
// @desc    Get question by ID
router.get('/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('author', 'username')
      .populate({
        path: 'answers',
        populate: {
          path: 'author',
          select: 'username'
        }
      });

    if (!question) {
      return res.status(404).json({ msg: 'Question not found' });
    }

    res.json(question);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Question not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/questions/:id/vote
// @desc    Vote on a question
router.put('/:id/vote', auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ msg: 'Question not found' });
    }

    const { voteType } = req.body;
    const userId = req.user.id;

    // Check if user already voted
    const existingVoteIndex = question.voters.findIndex(
      v => v.userId.toString() === userId
    );

    if (existingVoteIndex >= 0) {
      // User already voted - check if same vote type
      if (question.voters[existingVoteIndex].vote === (voteType === 'upvote' ? 1 : -1)) {
        // Same vote - remove vote
        question.votes -= question.voters[existingVoteIndex].vote;
        question.voters.splice(existingVoteIndex, 1);
      } else {
        // Different vote - update vote
        question.votes += voteType === 'upvote' ? 2 : -2;
        question.voters[existingVoteIndex].vote = voteType === 'upvote' ? 1 : -1;
      }
    } else {
      // New vote
      question.votes += voteType === 'upvote' ? 1 : -1;
      question.voters.push({
        userId,
        vote: voteType === 'upvote' ? 1 : -1
      });
    }

    await question.save();
    res.json({ votes: question.votes, voters: question.voters });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/questions/:id/accept
// @desc    Accept an answer
router.put('/:id/accept', auth, async (req, res) => {
  try {
    const { answerId } = req.body;
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ msg: 'Question not found' });
    }

    // Check if user is question author
    if (question.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Check if answer exists
    const answer = await Answer.findById(answerId);
    if (!answer) {
      return res.status(404).json({ msg: 'Answer not found' });
    }

    // Update answer accepted status
    answer.accepted = true;
    await answer.save();

    // Update question accepted answer
    question.acceptedAnswer = answerId;
    await question.save();

    res.json(question);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;